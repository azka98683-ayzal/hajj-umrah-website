"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/register", { method: "POST", body: JSON.stringify({ name, email, password }), headers: { "Content-Type": "application/json" } })
    if (res.ok) router.push("/login")
    else alert("Registration failed")
  }
  
  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold text-center mb-8">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  )
}
