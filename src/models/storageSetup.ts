import { serverStorage } from "@/lib/appwrite/server";
import { attachmentCollection, db } from "../name";
import { Permission } from "node-appwrite";

export default async function createQuestionAttachmentBucket() {
  try {
    await serverStorage.getBucket(attachmentCollection);
    console.log("Question Attachment bucket already exists");
    return;
  } catch {
    console.log("Creating Question Attachment bucket...");
  }

  await serverStorage.createBucket(
    attachmentCollection,
    attachmentCollection,
    [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ],
    false,
    undefined,
    undefined,
    ["jpg", "jpeg", "png", "webp", "pdf"]
  );

  console.log("Question attachment bucket created");
}
