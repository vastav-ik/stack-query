import { serverDatabases } from "@/lib/appwrite/server";
import { db, questionCollection } from "../name";
import { IndexType, Permission } from "node-appwrite";
import { log } from "console";
export default async function createQuestions() {
  await serverDatabases.createCollection(
    db,
    questionCollection,
    questionCollection,
    [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]
  );
  console.log("Questions collection created");

  await Promise.all([
    serverDatabases.createStringAttribute(
      db,
      questionCollection,
      "title",
      100,
      true
    ),
    serverDatabases.createStringAttribute(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),
    serverDatabases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),
    serverDatabases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),
    serverDatabases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined
    ),
  ]);
  console.log("Questions collection attributes created");

  await Promise.all([
    serverDatabases.createIndex(
      db,
      questionCollection,
      "title",
      IndexType.Fulltext,
      ["title"],
      ["asc"]
    ),
    serverDatabases.createIndex(
      db,
      questionCollection,
      "content",
      IndexType.Fulltext,
      ["content"],
      ["asc"]
    ),
  ]);
  console.log("Questions collection indexes created");
}
