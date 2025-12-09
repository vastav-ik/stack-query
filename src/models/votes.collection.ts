import { serverDatabases } from "@/lib/appwrite/server";
import { db, voteCollection } from "../name";
import { Permission } from "node-appwrite";

export default async function createVotes() {
  await serverDatabases.createCollection(db, voteCollection, voteCollection, [
    Permission.read("any"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Votes collection created");

  await Promise.all([
    serverDatabases.createEnumAttribute(
      db,
      voteCollection,
      "voteType",
      ["up", "down"],
      true
    ),

    serverDatabases.createEnumAttribute(
      db,
      voteCollection,
      "type",
      ["question", "answer"],
      true
    ),

    serverDatabases.createStringAttribute(
      db,
      voteCollection,
      "typeId",
      50,
      true
    ),

    serverDatabases.createStringAttribute(
      db,
      voteCollection,
      "votedBy",
      50,
      true
    ),
  ]);

  console.log("Votes collection attributes created");
}
