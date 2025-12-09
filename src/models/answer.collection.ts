import { serverDatabases } from "@/lib/appwrite/server";
import { db, answerCollection } from "../name";
import { Permission } from "node-appwrite";

export default async function createAnswers() {
  await serverDatabases.createCollection(
    db,
    answerCollection,
    answerCollection,
    [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]
  );

  console.log("Answers collection created");

  await Promise.all([
    serverDatabases.createStringAttribute(
      db,
      answerCollection,
      "content",
      10000,
      true
    ),
    serverDatabases.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      50,
      true
    ),
    serverDatabases.createStringAttribute(
      db,
      answerCollection,
      "authorId",
      50,
      true
    ),
  ]);

  console.log("Answers collection attributes created");
}
