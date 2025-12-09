const env = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string,
  serverKey: process.env.APPWRITE_KEY as string,
};

export default env;
