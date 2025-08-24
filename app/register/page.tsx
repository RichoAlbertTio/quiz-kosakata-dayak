// app/register/page.tsx
"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (r.ok) window.location.href = "/login";
    else alert(await r.text());
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto p-6 space-y-3">
      <input className="border p-2 w-full" value={name} onChange={(e)=>setName(e.target.value)} placeholder="name" />
      <input className="border p-2 w-full" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" />
      <input className="border p-2 w-full" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="password" />
      <button className="bg-black text-white px-3 py-2 rounded">Register</button>
    </form>
  );
}
