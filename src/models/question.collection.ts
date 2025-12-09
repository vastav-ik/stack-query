import {} from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "@/lib/appwrite/client";

export default async function createQuestions() {
  await databases.createCollection(db, questionCollection);
}
