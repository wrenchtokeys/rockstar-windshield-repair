import { NextRequest, NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";

function checkAuth(request: NextRequest) {
  const password = process.env.QUEUE_PASSWORD;
  if (!password) return false;
  const auth = request.headers.get("x-queue-auth");
  return auth === password;
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

    return NextResponse.json({ submissions: result.Items || [] });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
