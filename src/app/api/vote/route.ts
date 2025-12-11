import { serverDatabases, serverUsers } from "@/lib/appwrite/server";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/name";
import { ID, Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
  try {
    const { votedBy, type, typeId, voteType } = await request.json();

    const response = await serverDatabases.listDocuments(db, voteCollection, [
      Query.equal("typeId", typeId),
      Query.equal("type", type),
      Query.equal("votedBy", votedBy),
    ]);

    if (response.documents.length > 0) {
      await serverDatabases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );

      const QuestionOrAnswer = await serverDatabases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );
      const authorPrefs = await serverUsers.getPrefs<UserPrefs>(
        QuestionOrAnswer.authorId
      );

      await serverUsers.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
        reputation:
          response.documents[0].voteType === "up"
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    }

    if (!response.documents[0] || response.documents[0].voteType !== voteType) {
      const doc = await serverDatabases.createDocument(
        db,
        voteCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteType,
          votedBy,
        }
      );

      const QuestionOrAnswer = await serverDatabases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );
      const authorPrefs = await serverUsers.getPrefs<UserPrefs>(
        QuestionOrAnswer.authorId
      );

      // Calculate reputation change based on the NEW vote type
      await serverUsers.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
        reputation:
          voteType === "up"
            ? Number(authorPrefs.reputation) + 1
            : Number(authorPrefs.reputation) - 1,
      });
    }

    const [up, down] = await Promise.all([
      serverDatabases.listDocuments(db, voteCollection, [
        Query.equal("typeId", typeId),
        Query.equal("type", type),
        Query.equal("voteType", "up"),
        Query.equal("votedBy", votedBy),
        Query.limit(1),
      ]),
      serverDatabases.listDocuments(db, voteCollection, [
        Query.equal("typeId", typeId),
        Query.equal("type", type),
        Query.equal("voteType", "down"),
        Query.equal("votedBy", votedBy),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: up.total - down.total,
          up: up.documents.length,
          down: down.documents.length,
        },
        message: "Vote created successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error creating vote",
      },
      {
        status: error?.status || error.code || 500,
      }
    );
  }
}
