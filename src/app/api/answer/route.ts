import { serverDatabases, serverUsers } from "@/lib/appwrite/server";
import { answerCollection, db } from "@/name";
import { NextRequest, NextResponse } from "next/server";
import { ID, Users } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import { User } from "lucide-react";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();

    const response = await serverDatabases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        questionId: questionId,
        content: answer,
        authorId: authorId,
      }
    );
    const prefs = await serverUsers.getPrefs<UserPrefs>(authorId);
    await serverUsers.updatePrefs<UserPrefs>(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error creating answer",
      },
      {
        status: error?.status || error.code || 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId, authorId } = await request.json();
    const answer = await serverDatabases.getDocument(
      db,
      answerCollection,
      answerId
    );

    const response = await serverDatabases.deleteDocument(
      db,
      answerCollection,
      answerId
    );
    const prefs = await serverUsers.getPrefs<UserPrefs>(authorId);
    await serverUsers.updatePrefs<UserPrefs>(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    });
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error deleting answer",
      },
      {
        status: error?.status || error.code || 500,
      }
    );
  }
}
