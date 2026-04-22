"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) { setError("Rellena todos los campos."); return }
    if (tab === "register" && !username) { setError("Elige un nombre de explorador."); return }
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("nc_user", JSON.stringify({ email, username: username || email.split("@")[0], gems: 0 }))
      router.push("/")
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#030008] flex items-center justify-center relative overflow-hidden">
      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: Math.random() * 2 + 0.5, height: Math.random() * 2 + 0.5, opacity: Math.random() * 0.7 + 0.2 }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌌</div>
          <h1 className="text-3xl font-bold tracking-widest text-white">NEBULACRAFT</h1>
          <p className="text-white/40 text-sm mt-1">Forja tu galaxia</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-white/5 rounded-xl p-1">
            {(["login", "register"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setError("") }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-purple-600 text-white" : "text-white/40 hover:text-white/70"}`}>
                {t === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="text-xs text-white/50 block mb-1">Nombre de explorador</label>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="Comandante Nova" maxLength={20}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            )}
            <div>
              <label className="text-xs text-white/50 block mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="explorador@cosmos.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white disabled:opacity-50">
              {loading ? "Conectando..." : tab === "login" ? "Explorar el cosmos →" : "Crear cuenta →"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-center text-xs text-white/30 mb-3">O entra con</p>
            <div className="flex gap-2">
              {["🔵 Google", "⚫ Apple"].map(p => (
                <button key={p} onClick={() => { setLoading(true); setTimeout(() => router.push("/"), 800) }}
                  className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-4">Demo — sin backend real</p>
      </div>
    </div>
  )
}
