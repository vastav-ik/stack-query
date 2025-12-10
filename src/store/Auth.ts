import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/lib/appwrite/client";

export interface UserPrefs {
  reputation: number;
}

interface AuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated: () => void;
  verifySession: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set((state) => {
          state.hydrated = true;
        });
      },

      async verifySession() {
        try {
          const session = await account.getSession("current");

          set((state) => {
            state.session = session;
          });
        } catch (error) {
          console.log(error);
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation)
            await account.updatePrefs<UserPrefs>({ reputation: 0 });

          set((state) => {
            state.session = session;
            state.jwt = jwt;
            state.user = user;
          });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async createAccount(name: string, email: string, password: string) {
        try {
          const user = await account.create(ID.unique(), email, password, name);
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const jwt = await account.create(ID.unique(), email, password, name);

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async logout() {
        await account.deleteSessions();
        set((state) => {
          state.session = null;
          state.jwt = null;
          state.user = null;
        });
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (error) {
            console.log(error);
          }
          state?.setHydrated();
        };
      },
    }
  )
);
