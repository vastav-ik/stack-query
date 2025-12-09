import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createDatabase from "./models/dbsetup";
import createQuestionAttachmentBucket from "./models/storageSetup";
import { promiseHooks } from "v8";

export async function proxy(request: NextRequest) {
  await Promise.all([createDatabase(), createQuestionAttachmentBucket()]);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
