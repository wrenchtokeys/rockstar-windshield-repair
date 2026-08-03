import { NextRequest, NextResponse } from "next/server";
import { UpdateCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { autoRequestReview } from "@/lib/review-request";
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

// Update a submission (status, notes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const updates: string[] = [];
    const removes: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};

    if (body.status && VALID_STATUSES.includes(body.status)) {
      updates.push("#s = :status");
      names["#s"] = "status";
      values[":status"] = body.status;

      // Set contactedAt on first status change from "new"
      if (body.status !== "new" && !body.skipContactedAt) {
        updates.push("contactedAt = :contactedAt");
        values[":contactedAt"] = new Date().toISOString();
      }
    }

    if (body.notes !== undefined) {
      updates.push("notes = :notes");
      values[":notes"] = body.notes;
    }

    if (body.quotePrice !== undefined) {
      updates.push("quotePrice = :quotePrice");
      values[":quotePrice"] =
        typeof body.quotePrice === "string" ? body.quotePrice.trim().slice(0, 50) : "";
    }

    if (body.scheduledFor !== undefined) {
      updates.push("scheduledFor = :scheduledFor");
      values[":scheduledFor"] =
        typeof body.scheduledFor === "string" ? body.scheduledFor.trim().slice(0, 50) : "";
    }

    if (body.markReviewRequested === true) {
      updates.push("reviewRequestedAt = :reviewRequestedAt");
      values[":reviewRequestedAt"] = new Date().toISOString();
    }

    if (body.markReviewFollowup === true) {
      updates.push("reviewFollowupAt = :reviewFollowupAt");
      values[":reviewFollowupAt"] = new Date().toISOString();
    }

    // The owner spotted the customer's review on Google — record it so
    // every further ask (manual and automated) stops. unmark handles a
    // mis-tap.
    if (body.markReviewLeft === true) {
      updates.push("reviewLeftAt = :reviewLeftAt");
      values[":reviewLeftAt"] = new Date().toISOString();
    } else if (body.unmarkReviewLeft === true) {
      removes.push("reviewLeftAt");
    }

    if (updates.length === 0 && removes.length === 0 && body.requestReview !== true) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    if (updates.length > 0 || removes.length > 0) {
      updates.push("updatedAt = :updatedAt");
      values[":updatedAt"] = new Date().toISOString();

      await docClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id },
          UpdateExpression:
            `SET ${updates.join(", ")}` +
            (removes.length > 0 ? ` REMOVE ${removes.join(", ")}` : ""),
          ExpressionAttributeNames: Object.keys(names).length > 0 ? names : undefined,
          ExpressionAttributeValues: values,
        })
      );
    }

    // The review request only fires on an explicit requestReview from the
    // dashboard's "Send Review Request" button — never as a side effect of
    // a status change. The owner verifies the customer hasn't already
    // reviewed before tapping it. Awaited (not fire-and-forget) because
    // serverless kills background work after the response; idempotent via
    // the conditional-write claims. autoTexted tells the dashboard whether
    // to fall back to the manual Messages composer.
    let autoTexted = false;
    let autoEmailed = false;
    if (body.requestReview === true) {
      const { Item } = await docClient.send(
        new GetCommand({ TableName: TABLE_NAME, Key: { id } })
      );
      if (Item && (Item as Submission).status === "won") {
        const { texted, emailed } = await autoRequestReview(Item as Submission);
        autoTexted = texted;
        autoEmailed = emailed;
      }
    }

    return NextResponse.json({ success: true, autoTexted, autoEmailed });
  } catch (error) {
    console.error("Failed to update submission:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

// Delete a submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await docClient.send(
      new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete submission:", error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
