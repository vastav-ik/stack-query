"use client";

import { useAuthStore } from "@/store/Auth";
import React, { useState } from "react";

function loginPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    } else {
      setIsLoading(true);
      setError("");

      const loginRes = await login(email, password);

      if (loginRes.error) {
        setError(loginRes.error!.message);
        setIsLoading(false);
        return;
      }
    }
  };

  return (
    <div>
      <div>
        {error && <p>{error}</p>}
        <form onSubmit={handLogin}>
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
        </form>
      </div>
    </div>
  );
}

export default loginPage;
