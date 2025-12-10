"use client";

import { useAuthStore } from "@/store/Auth";
import React, { useState } from "react";

function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await createAccount(firstname, email, password);
    setIsLoading(false);

    if (res.error) setError(res.error.message);
    else {
      const res = await login(email, password);
      setIsLoading(false);
    }
    if (res.error) setError(res.error.message);
  };

  return (
    <div className="">
      <div>
        {error && <p>{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" name="firstname" placeholder="First Name" />
          <input type="text" name="lastname" placeholder="Last Name" />
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
          />
          <button type="submit">{isLoading ? "Loading..." : "Register"}</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
