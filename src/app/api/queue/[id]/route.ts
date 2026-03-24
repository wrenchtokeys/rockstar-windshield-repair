import { NextRequest, NextResponse } from "next/server";
import { UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import type { SubmissionStatus } from "@/types/submission";

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

    if (updates.length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    updates.push("updatedAt = :updatedAt");
    values[":updatedAt"] = new Date().toISOString();

    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updates.join(", ")}`,
        ExpressionAttributeNames: Object.keys(names).length > 0 ? names : undefined,
        ExpressionAttributeValues: values,
      })
    );

    return NextResponse.json({ success: true });
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
