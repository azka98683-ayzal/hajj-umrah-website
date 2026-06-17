"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.ok) router.push("/dashboard")
    else alert("Invalid credentials")
  }
  
  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  )
}
