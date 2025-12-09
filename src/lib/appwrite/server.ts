import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";
import env from "@/lib/env";

const client = new Client()
  .setEndpoint(env.endpoint)
  .setProject(env.projectId)
  .setKey(env.serverKey);
export const serverDatabases = new Databases(client);
export const serverStorage = new Storage(client);
export const serverAvatars = new Avatars(client);
export const serverUsers = new Users(client);
export default client;
