"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Offline mode entry point.
 * No backend exists — the game is fully local. This page just asks the player
 * to pick an explorer name that gets stored in localStorage.
 */
export default function OfflineSetupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handlePlay = (e: React.FormEvent) => {
    e.preventDefault()
    const name = username.trim() || "Explorador"
    localStorage.setItem("nc_user", JSON.stringify({ username: name }))
    router.push("/")
  }

  const handleSkip = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#030008] flex items-center justify-center relative overflow-hidden">
      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              opacity: Math.random() * 0.7 + 0.2,
            }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌌</div>
          <h1 className="text-3xl font-bold tracking-widest text-white">NEBULACRAFT</h1>
          <p className="text-white/40 text-sm mt-1">Forja tu galaxia</p>
        </div>

        {/* Offline notice */}
        <div className="mb-5 flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-sm text-blue-300">
          <span className="text-lg mt-0.5">🔒</span>
          <div>
            <div className="font-semibold mb-0.5">Modo offline — sin cuenta necesaria</div>
            <div className="text-xs text-blue-300/70">
              NebulaCraft se juega completamente en tu navegador. Tu progreso se guarda
              en este dispositivo mediante localStorage. No se envían datos a ningún servidor.
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold text-center mb-1">¿Cómo quieres llamarte?</h2>
          <p className="text-white/40 text-xs text-center mb-5">Opcional — puedes cambiar el nombre en cualquier momento</p>

          <form onSubmit={handlePlay} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 block mb-1">Nombre de explorador</label>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError("") }}
                placeholder="Comandante Nova"
                maxLength={20}
                autoFocus
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
            >
              Explorar el cosmos →
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <button
              onClick={handleSkip}
              className="text-white/30 text-xs hover:text-white/60 transition-colors"
            >
              Jugar sin nombre
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-4">
          Sin cuenta · Sin backend · 100% local
        </p>
      </div>
    </div>
  )
}
