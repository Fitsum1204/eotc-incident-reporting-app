"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCredentialsLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!res?.error) {
  window.location.href = "/admin";
}
    if (res?.error) {
      setError("Invalid email or password");
    } 
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Admin Login</h1>

        {/* Google */}
        <Button
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
        >
          Sign in with Google
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          or
        </div>

        {/* Email */}
        <Input
          placeholder="Admin email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleCredentialsLogin}
        >
          Sign in with Email
        </Button>
      </div>
    </div>
  );
}
