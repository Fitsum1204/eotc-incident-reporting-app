'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) {
        setError("All fields are required");
        return;
      }

      // Hash password before sending to Sanity
      const hashedPassword = await bcrypt.hash(password, 10);

      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: hashedPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to register");
        return;
      }
      
      router.push("/admin/login");
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Admin Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </div>
    </div>
  );
}
