import { db } from "@/name";
import createAnswers from "./answer.collection";
import createComments from "./comment.collection";
import createQuestions from "./question.collection";
import createVotes from "./votes.collection";
import createQuestionAttachmentBucket from "./storageSetup";

import { serverDatabases } from "../lib/appwrite/server";

export default async function createDatabase() {
  try {
    await serverDatabases.get(db);
    console.log("Database already exists");
  } catch (error) {
    try {
      await serverDatabases.create(db, db);
      console.log("Database created");

      await Promise.all([
        createAnswers(),
        createComments(),
        createQuestions(),
        createVotes(),
        createQuestionAttachmentBucket(),
      ]);
      console.log("All collections created");
    } catch (error) {
      console.log("Error creating database");
      console.log(error);
    }
  }

  return serverDatabases;
}
