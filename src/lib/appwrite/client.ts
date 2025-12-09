import { Client, Account, Databases, Storage, Avatars } from "appwrite";
import env from "@/lib/env";

const client = new Client().setEndpoint(env.endpoint).setProject(env.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export default client;
