import { NextRequest, NextResponse } from "next/server";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { processDueReviewFollowups } from "@/lib/review-request";
import type { Submission, SubmissionStatus } from "@/types/submission";

function checkAuth(request: NextRequest) {
  const password = process.env.QUEUE_PASSWORD;
  if (!password) return false;
  const auth = request.headers.get("x-queue-auth");
  return auth === password;
}

const VALID_STATUSES: SubmissionStatus[] = [
  "new", "contacted", "quoted", "scheduled", "won", "lost",
];

function cleanString(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = request.nextUrl.searchParams.get("status");

    let result;
    if (status) {
      // Query by status using GSI
      const { QueryCommand } = await import("@aws-sdk/lib-dynamodb");
      result = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "status-submitted-index",
          KeyConditionExpression: "#s = :status",
          ExpressionAttributeNames: { "#s": "status" },
          ExpressionAttributeValues: { ":status": status },
          ScanIndexForward: false, // newest first
        })
      );
    } else {
      // Get all submissions
      result = await docClient.send(
        new ScanCommand({ TableName: TABLE_NAME })
      );
      // Sort by submittedAt descending
      result.Items?.sort((a, b) =>
        (b.submittedAt as string).localeCompare(a.submittedAt as string)
      );
    }

    // Piggyback the automated review follow-ups on dashboard loads — this
    // runs every poll but only acts when a Won lead's initial email is 3+
    // days old with no follow-up yet, and the conditional-write claim in
    // processDueReviewFollowups makes concurrent polls safe.
    try {
      await processDueReviewFollowups((result.Items || []) as Submission[]);
    } catch (error) {
      console.error("Review follow-up processing failed:", error);
    }

    return NextResponse.json({ submissions: result.Items || [] });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// Manually add a lead — for the jobs that never touch the contact form
// (phone calls, referrals, parking-lot walk-ups). Puts them in the same
// pipeline so they get the same Won → review-request SMS treatment.
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const name = cleanString(body.name, 100);
    const phone = cleanString(body.phone, 30);

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    // The review-request SMS is the whole point of a manual lead, and it
    // needs a real number to deep-link into Messages.
    if (phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "A valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    // A customer is identified by phone or email — catch the same person
    // being added twice (form submission + manual add, or two manual adds).
    // The dashboard sends allowDuplicate after the owner confirms it's a
    // genuine repeat job. Compare on the last 10 digits so "(919) 555-0100"
    // and "+19195550100" match; the table is one-man-shop sized, so a scan
    // is fine.
    if (body.allowDuplicate !== true) {
      const email = cleanString(body.email, 200).toLowerCase();
      const phoneKey = phone.replace(/\D/g, "").slice(-10);
      const existing = await docClient.send(
        new ScanCommand({ TableName: TABLE_NAME })
      );
      const match = (existing.Items || []).find((item) => {
        const itemPhone = String(item.phone || "").replace(/\D/g, "").slice(-10);
        const itemEmail = String(item.email || "").trim().toLowerCase();
        return (
          (phoneKey && itemPhone === phoneKey) ||
          (email && itemEmail === email)
        );
      });
      if (match) {
        return NextResponse.json(
          {
            error: "This customer is already in the queue",
            existing: {
              id: match.id,
              name: match.name,
              phone: match.phone,
              status: match.status,
              submittedAt: match.submittedAt,
            },
          },
          { status: 409 }
        );
      }
    }

    const status: SubmissionStatus = VALID_STATUSES.includes(body.status)
      ? body.status
      : "new";
    const now = new Date().toISOString();

    const item: Submission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      phone,
      email: cleanString(body.email, 200),
      serviceType: cleanString(body.serviceType, 100),
      vehicleInfo: cleanString(body.vehicleInfo, 200),
      damageDescription: cleanString(body.damageDescription, 1000),
      preferredContact: "phone",
      status,
      notes: cleanString(body.notes, 1000),
      quotePrice: cleanString(body.quotePrice, 50),
      scheduledFor: cleanString(body.scheduledFor, 50),
      submittedAt: now,
      source: "manual",
      // Anything past "new" means the conversation already happened offline.
      ...(status !== "new" ? { contactedAt: now } : {}),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    // No automatic review request on create — even for Won leads, the ask
    // goes out only when the owner taps "Send Review Request" on the card.
    return NextResponse.json({ submission: item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create submission:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
