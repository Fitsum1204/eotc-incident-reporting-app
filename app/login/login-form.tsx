// app/login/login-form.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link  from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 border rounded-xl p-6 shadow">
      <h1 className="text-2xl font-semibold text-center">
        Login to your account
      </h1>

      {/* Email / Password */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Google OAuth */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Continue with Google
      </Button>
     
      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link href="/register" className="underline">
          Sign up
        </Link>
      </p>

    </div>
  );
}
