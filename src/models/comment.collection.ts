import { serverDatabases } from "@/lib/appwrite/server";
import { db, commentCollection } from "../name";
import { Permission } from "node-appwrite";

export default async function createComments() {
  await serverDatabases.createCollection(
    db,
    commentCollection,
    commentCollection,
    [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]
  );

  console.log("Comments collection created");

  await Promise.all([
    serverDatabases.createStringAttribute(
      db,
      commentCollection,
      "content",
      2000,
      true
    ),

    serverDatabases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["question", "answer"],
      true
    ),

    serverDatabases.createStringAttribute(
      db,
      commentCollection,
      "typeId",
      50,
      true
    ),
    serverDatabases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      50,
      true
    ),
  ]);

  console.log("Comments collection attributes created");
}
