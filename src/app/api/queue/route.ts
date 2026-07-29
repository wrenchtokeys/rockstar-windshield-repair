import { NextRequest, NextResponse } from "next/server";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { autoRequestReview, processDueReviewFollowups } from "@/lib/review-request";
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
      submittedAt: now,
      source: "manual",
      // Anything past "new" means the conversation already happened offline.
      ...(status !== "new" ? { contactedAt: now } : {}),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    // The parking-lot case: lead added straight in as Won. Same automated
    // review request as flipping a status to Won; autoTexted tells the
    // dashboard to skip the manual Messages composer.
    let autoTexted = false;
    if (item.status === "won") {
      const { texted } = await autoRequestReview(item);
      autoTexted = texted;
    }

    return NextResponse.json({ submission: item, autoTexted }, { status: 201 });
  } catch (error) {
    console.error("Failed to create submission:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
