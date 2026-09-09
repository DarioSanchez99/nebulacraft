"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ACHIEVEMENTS, type AchievementStats } from "@/lib/achievements"

// ─── Shop packs ──────────────────────────────────────────────────────────────

const GEM_PACKS = [
  { id: "g1", name: "Nebulón Pequeño", gems: 100, bonus: 0, price: "0,99 €", icon: "💎", color: "from-blue-600 to-blue-800" },
  { id: "g2", name: "Polvo Estelar", gems: 550, bonus: 50, price: "4,99 €", icon: "💠", color: "from-purple-600 to-purple-800", popular: true },
  { id: "g3", name: "Nova Burst", gems: 1200, bonus: 200, price: "9,99 €", icon: "🔮", color: "from-cyan-600 to-blue-800" },
  { id: "g4", name: "Galaxia Pack", gems: 3000, bonus: 1000, price: "19,99 €", icon: "🌌", color: "from-pink-600 to-purple-900" },
]

const GEM_BOOSTS = [
  { id: "b1", cost: 50, name: "Turbo Click (1h)", icon: "⚡", description: "×10 por clic durante 1 hora", effect: "click" },
  { id: "b2", cost: 80, name: "Auto-Farm (1h)", icon: "🤖", description: "×5 producción durante 1 hora", effect: "farm" },
  { id: "b3", cost: 200, name: "Supernova", icon: "💥", description: "+10.000 polvo estelar instantáneo", effect: "instant" },
  { id: "b4", cost: 500, name: "Salto Temporal", icon: "⏳", description: "8 horas de producción al instante", effect: "timeskip" },
]

// ─── Shop Modal ───────────────────────────────────────────────────────────────

function ShopModal({ gems, activeBoosts, onClose, onBuyPack, onBuyBoost }: {
  gems: number
  activeBoosts: ActiveBoosts
  onClose: () => void
  onBuyPack: (pack: typeof GEM_PACKS[0]) => void
  onBuyBoost: (boost: typeof GEM_BOOSTS[0]) => void
}) {
  const [tab, setTab] = useState<"packs" | "boosts">("packs")
  const [bought, setBought] = useState<string | null>(null)
  const now = Date.now()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md mx-4 bg-[#0a0018] border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">🛒 Tienda Cósmica</h2>
            <p className="text-white/60 text-xs mt-0.5">Demo — ningún cargo real</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-yellow-300">💎 {gems}</div>
            <div className="text-xs text-white/50">gemas</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(["packs", "boosts"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === t ? "text-purple-400 border-b-2 border-purple-400" : "text-white/40 hover:text-white/70"}`}>
              {t === "packs" ? "💎 Packs de gemas" : "⚡ Potenciadores"}
            </button>
          ))}
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {tab === "packs" && (
            <div className="space-y-3">
              <p className="text-xs text-white/30 text-center">Demo — los pagos no se procesan</p>
              {GEM_PACKS.map(pack => (
                <button key={pack.id} onClick={() => { onBuyPack(pack); setBought(pack.id); setTimeout(() => setBought(null), 1500) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${pack.color} border border-white/10 hover:border-white/30 transition-all relative overflow-hidden group`}>
                  {pack.popular && (
                    <span className="absolute top-2 right-2 text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-full">⭐ Popular</span>
                  )}
                  <span className="text-3xl">{pack.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-bold text-white">{pack.name}</div>
                    <div className="text-sm text-white/70">
                      {pack.gems} gemas {pack.bonus > 0 && <span className="text-yellow-300">+{pack.bonus} BONUS</span>}
                    </div>
                  </div>
                  <div className={`font-bold text-lg text-white transition-transform ${bought === pack.id ? "scale-150" : "group-hover:scale-110"}`}>
                    {bought === pack.id ? "✓" : pack.price}
                  </div>
                </button>
              ))}
            </div>
          )}

          {tab === "boosts" && (
            <div className="space-y-3">
              {GEM_BOOSTS.map(boost => {
                const canAfford = gems >= boost.cost
                const boostKey = boost.effect as keyof ActiveBoosts
                const endTime = activeBoosts[boostKey]
                const isActive = endTime !== null && endTime > now
                const remainingMs = isActive && endTime ? endTime - now : 0
                const remainingMin = Math.ceil(remainingMs / 60_000)
                return (
                  <button key={boost.id} onClick={() => { if (canAfford && !isActive) { onBuyBoost(boost); setBought(boost.id); setTimeout(() => setBought(null), 1500) }}}
                    disabled={!canAfford || isActive}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isActive
                        ? "border-green-500/40 bg-green-500/10 cursor-not-allowed"
                        : canAfford
                        ? "border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20"
                        : "border-white/5 bg-white/5 opacity-40 cursor-not-allowed"
                    }`}>
                    <span className="text-3xl">{boost.icon}</span>
                    <div className="text-left flex-1">
                      <div className="font-bold text-white">{boost.name}</div>
                      <div className="text-xs text-white/50">{boost.description}</div>
                      {isActive && <div className="text-xs text-green-400 mt-0.5">Activo — {remainingMin} min restantes</div>}
                    </div>
                    <div className={`font-bold text-yellow-300 transition-transform ${bought === boost.id ? "scale-150 text-green-400" : ""}`}>
                      {isActive ? "✓" : bought === boost.id ? "✓" : `💎${boost.cost}`}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 text-center">
          <button onClick={onClose} className="text-white/40 text-sm hover:text-white transition-colors">Cerrar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Achievement Toast ────────────────────────────────────────────────────────

function AchievementToast({ achievement, onDone }: { achievement: { name: string; icon: string; description: string }; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#1a0040] border border-purple-500/60 rounded-2xl px-5 py-4 shadow-2xl"
      style={{ animation: "slideUp 0.4s ease forwards" }}>
      <span className="text-3xl">{achievement.icon}</span>
      <div>
        <div className="text-xs text-purple-400 font-bold uppercase tracking-widest">Logro desbloqueado</div>
        <div className="text-sm font-bold text-white">{achievement.name}</div>
        <div className="text-xs text-white/50">{achievement.description}</div>
      </div>
    </div>
  )
}

// ─── Achievements Panel ───────────────────────────────────────────────────────

function AchievementsPanel({ unlocked, onClose }: { unlocked: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md mx-4 bg-[#0a0018] border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">🏆 Logros</h2>
          <span className="text-sm text-purple-300">{unlocked.length}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-3">
          {ACHIEVEMENTS.map(a => {
            const done = unlocked.includes(a.id)
            return (
              <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${done ? "border-purple-500/40 bg-purple-500/10" : "border-white/5 bg-white/5 opacity-50"}`}>
                <span className="text-2xl" style={{ filter: done ? "none" : "grayscale(1)" }}>{a.icon}</span>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${done ? "text-white" : "text-white/40"}`}>{a.name}</div>
                  <div className="text-xs text-white/40">{a.description}</div>
                </div>
                {done && <span className="text-green-400 text-lg">✓</span>}
              </div>
            )
          })}
        </div>
        <div className="p-4 border-t border-white/10 text-center">
          <button onClick={onClose} className="text-white/40 text-sm hover:text-white transition-colors">Cerrar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Singularity / Prestige Screen ───────────────────────────────────────────

function SingularityScreen({ prestigeLevel, onPrestige }: { prestigeLevel: number; onPrestige: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="text-center max-w-sm mx-4">
        <div className="text-7xl mb-4" style={{ animation: "pulse 2s ease-in-out infinite" }}>🕳️</div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">¡Has alcanzado la Singularidad!</h2>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">
          El tiempo y el espacio se doblan a tu voluntad. Has llegado al final del universo conocido.<br/>
          ¿Te atreves a reiniciar y forjar una nueva galaxia con poderes amplificados?
        </p>

        {prestigeLevel > 0 && (
          <div className="mb-4 text-purple-300 text-sm">
            Nivel de prestigio actual: <span className="font-bold text-yellow-300">✦{prestigeLevel}</span> — multiplicador permanente ×{(1 + prestigeLevel * 0.5).toFixed(1)}
          </div>
        )}

        <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-4 mb-6 text-left text-sm space-y-1">
          <div className="text-white/70">Al hacer Prestige obtendrás:</div>
          <div className="text-yellow-300">✦ Nivel de Prestigio {prestigeLevel + 1}</div>
          <div className="text-yellow-300">✦ Multiplicador permanente ×{(1 + (prestigeLevel + 1) * 0.5).toFixed(1)} en todo el juego</div>
          <div className="text-red-400 text-xs mt-2">⚠ Se perderá todo el progreso actual (excepto gemas y logros)</div>
        </div>

        <button onClick={onPrestige}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-900/50">
          ✦ Prestige Reset
        </button>
        <p className="text-white/20 text-xs mt-3">O sigue acumulando polvo estelar sin límite</p>
      </div>
    </div>
  )
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Producer {
  id: string
  name: string
  icon: string
  description: string
  baseCost: number
  baseProduction: number
  count: number
}

interface ClickUpgrade {
  id: string
  name: string
  icon: string
  description: string
  cost: number
  multiplier: number
  bought: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  value: string
}

/** Stores end timestamps (ms since epoch) for timed boosts, null = inactive */
interface ActiveBoosts {
  click: number | null
  farm: number | null
}

// ─── Stage definitions ───────────────────────────────────────────────────────

const STAGES = [
  {
    name: "Roca Estéril",
    threshold: 0,
    sphere: {
      base: "radial-gradient(circle at 38% 32%, #aaa 0%, #888 30%, #555 65%, #333 100%)",
      overlay: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25) 0%, transparent 40%)",
      shadow: "inset -30px -20px 60px rgba(0,0,0,0.7)",
      glow: "0 0 20px 4px rgba(100,100,100,0.2)",
      atmosphere: "none",
      cloudColor: "rgba(80,80,80,0.3)",
    },
    label: "Sin atmósfera. Sin vida. Solo silencio.",
    emoji: "🪨",
  },
  {
    name: "Mundo Volcánico",
    threshold: 1_000,
    sphere: {
      base: "radial-gradient(circle at 38% 32%, #c0392b 0%, #8B0000 35%, #4a0000 70%, #1a0000 100%)",
      overlay: "radial-gradient(circle at 35% 30%, rgba(255,180,50,0.35) 0%, transparent 45%)",
      shadow: "inset -30px -20px 60px rgba(0,0,0,0.6)",
      glow: "0 0 50px 20px rgba(255,60,0,0.45), 0 0 100px 40px rgba(200,30,0,0.2)",
      atmosphere: "0 0 0 12px rgba(255,80,0,0.12), 0 0 0 24px rgba(255,80,0,0.05)",
      cloudColor: "rgba(180,60,0,0.4)",
    },
    label: "Lava hirviente cubre la superficie. El planeta despierta.",
    emoji: "🌋",
  },
  {
    name: "Mundo Primordial",
    threshold: 10_000,
    sphere: {
      base: "radial-gradient(circle at 38% 32%, #5d7c3a 0%, #3a5c2a 35%, #2a4a1a 65%, #1a2a0a 100%)",
      overlay: "radial-gradient(circle at 35% 30%, rgba(180,220,100,0.3) 0%, transparent 45%)",
      shadow: "inset -30px -20px 60px rgba(0,0,0,0.55)",
      glow: "0 0 50px 15px rgba(80,160,40,0.4), 0 0 90px 35px rgba(50,120,20,0.15)",
      atmosphere: "0 0 0 14px rgba(100,180,50,0.15), 0 0 0 28px rgba(80,150,30,0.06)",
      cloudColor: "rgba(200,220,150,0.35)",
    },
    label: "Gases tóxicos y nubes densas. La vida podría emerger.",
    emoji: "🌿",
  },
  {
    name: "Mundo Oceánico",
    threshold: 100_000,
    sphere: {
      base: "radial-gradient(circle at 38% 32%, #1565C0 0%, #0D47A1 35%, #0a2a6a 70%, #050f2a 100%)",
      overlay: "radial-gradient(circle at 35% 30%, rgba(100,180,255,0.35) 0%, transparent 45%)",
      shadow: "inset -30px -20px 60px rgba(0,0,0,0.5)",
      glow: "0 0 55px 20px rgba(30,120,255,0.4), 0 0 100px 45px rgba(10,80,200,0.18)",
      atmosphere: "0 0 0 16px rgba(80,160,255,0.18), 0 0 0 32px rgba(50,120,220,0.07)",
      cloudColor: "rgba(220,235,255,0.45)",
    },
    label: "Océanos sin fin. La vida prospera bajo las olas.",
    emoji: "🌊",
  },
  {
    name: "Mundo Vivo",
    threshold: 1_000_000,
    sphere: {
      base: "radial-gradient(circle at 38% 32%, #27ae60 0%, #1a8a45 25%, #0d5c2a 50%, #1565C0 75%, #0a2a6a 100%)",
      overlay: "radial-gradient(circle at 35% 30%, rgba(150,255,150,0.3) 0%, transparent 45%)",
      shadow: "inset -30px -20px 60px rgba(0,0,0,0.45)",
      glow: "0 0 55px 22px rgba(30,200,80,0.35), 0 0 100px 50px rgba(20,150,60,0.15)",
      atmosphere: "0 0 0 18px rgba(100,220,120,0.18), 0 0 0 36px rgba(80,180,100,0.07)",
      cloudColor: "rgba(240,248,255,0.5)",
    },
    label: "Continentes verdes y océanos azules. Civilización emergente.",
    emoji: "🌍",
  },
  {
    name: "Mundo Civilizado",
    threshold: 10_000_000,
    sphere: {
      base: "radial-gradient(circle at 38% 32%, #2c3e50 0%, #1a252f 35%, #0d1520 65%, #050a10 100%)",
      overlay: "radial-gradient(circle at 35% 30%, rgba(255,220,80,0.2) 0%, transparent 45%)",
      shadow: "inset -30px -20px 60px rgba(0,0,0,0.4)",
      glow: "0 0 55px 22px rgba(255,180,30,0.3), 0 0 100px 50px rgba(200,130,20,0.12)",
      atmosphere: "0 0 0 18px rgba(255,200,50,0.12), 0 0 0 36px rgba(200,150,30,0.05)",
      cloudColor: "rgba(255,230,100,0.25)",
    },
    label: "Luces de ciudades brillan en la oscuridad. Tecnología avanzada.",
    emoji: "🏙️",
  },
  {
    name: "Colapso Estelar",
    threshold: 100_000_000,
    sphere: {
      base: "radial-gradient(circle at 40% 40%, #fff9e6 0%, #ffe066 20%, #ffa500 50%, #ff4500 80%, #b22222 100%)",
      overlay: "radial-gradient(circle at 35% 30%, rgba(255,255,200,0.6) 0%, transparent 40%)",
      shadow: "inset -20px -20px 40px rgba(180,50,0,0.3)",
      glow: "0 0 80px 35px rgba(255,150,0,0.7), 0 0 160px 80px rgba(255,80,0,0.35), 0 0 240px 120px rgba(255,50,0,0.15)",
      atmosphere: "0 0 0 22px rgba(255,180,0,0.25), 0 0 0 44px rgba(255,120,0,0.1)",
      cloudColor: "rgba(255,220,80,0.3)",
    },
    label: "Tu planeta ha colapsado en una estrella. Poder sin igual.",
    emoji: "⭐",
  },
  {
    name: "Singularidad",
    threshold: 1_000_000_000,
    sphere: {
      base: "radial-gradient(circle at 50% 50%, #000 0%, #0a0010 40%, #1a0030 70%, #000 100%)",
      overlay: "radial-gradient(circle at 35% 30%, rgba(150,0,255,0.15) 0%, transparent 50%)",
      shadow: "inset 0 0 80px rgba(0,0,0,0.95)",
      glow: "0 0 60px 25px rgba(100,0,255,0.5), 0 0 120px 60px rgba(50,0,200,0.25), 0 0 200px 100px rgba(20,0,150,0.1)",
      atmosphere: "0 0 0 20px rgba(120,0,255,0.2), 0 0 0 40px rgba(80,0,200,0.08)",
      cloudColor: "rgba(120,0,255,0.2)",
    },
    label: "Un agujero negro. El tiempo y el espacio se doblan a tu voluntad.",
    emoji: "🕳️",
  },
]

// ─── Producers config ─────────────────────────────────────────────────────────

const INITIAL_PRODUCERS: Producer[] = [
  { id: "probe", name: "Sonda Solar", icon: "🛰️", description: "+1 polvo/s", baseCost: 50, baseProduction: 1, count: 0 },
  { id: "drone", name: "Dron Minero", icon: "🤖", description: "+8 polvo/s", baseCost: 200, baseProduction: 8, count: 0 },
  { id: "station", name: "Estación Orbital", icon: "🏗️", description: "+40 polvo/s", baseCost: 1_000, baseProduction: 40, count: 0 },
  { id: "replicator", name: "Replicador de Materia", icon: "⚛️", description: "+200 polvo/s", baseCost: 5_000, baseProduction: 200, count: 0 },
  { id: "dyson", name: "Anillo de Dyson", icon: "💫", description: "+1,000 polvo/s", baseCost: 25_000, baseProduction: 1_000, count: 0 },
  { id: "darkmatter", name: "Motor de Materia Oscura", icon: "🌑", description: "+5,000 polvo/s", baseCost: 100_000, baseProduction: 5_000, count: 0 },
  { id: "rift", name: "Fisura de Realidad", icon: "🌀", description: "+25,000 polvo/s", baseCost: 500_000, baseProduction: 25_000, count: 0 },
  { id: "void", name: "Cosechador del Vacío", icon: "🕳️", description: "+150,000 polvo/s", baseCost: 2_500_000, baseProduction: 150_000, count: 0 },
]

const INITIAL_CLICK_UPGRADES: ClickUpgrade[] = [
  { id: "cu1", name: "Sensores Mejorados", icon: "📡", description: "×2 por clic", cost: 100, multiplier: 2, bought: false },
  { id: "cu2", name: "Amplificador Cuántico", icon: "⚡", description: "×3 por clic", cost: 500, multiplier: 3, bought: false },
  { id: "cu3", name: "Toque de Singularidad", icon: "💎", description: "×5 por clic", cost: 2_500, multiplier: 5, bought: false },
  { id: "cu4", name: "Mano de Dios", icon: "🌌", description: "×10 por clic", cost: 20_000, multiplier: 10, bought: false },
  { id: "cu5", name: "Voluntad Cósmica", icon: "✨", description: "×25 por clic", cost: 200_000, multiplier: 25, bought: false },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(2) + "K"
  return Math.floor(n).toString()
}

function producerCost(base: number, count: number) {
  return Math.ceil(base * Math.pow(1.15, count))
}

// ─── Planet Component ─────────────────────────────────────────────────────────

function Planet({ stage, onClick, pulse }: { stage: number; onClick: (e: React.MouseEvent) => void; pulse: boolean }) {
  const s = STAGES[stage]
  const v = s.sphere

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Outer atmosphere ring */}
      {stage >= 1 && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300,
            height: 300,
            background: "transparent",
            boxShadow: v.atmosphere,
            transition: "all 1.2s ease",
          }}
        />
      )}

      {/* Accretion disk for black hole */}
      {stage === 7 && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 380,
            height: 80,
            background: "linear-gradient(90deg, transparent 0%, rgba(100,0,255,0.6) 30%, rgba(200,100,255,0.9) 50%, rgba(100,0,255,0.6) 70%, transparent 100%)",
            filter: "blur(8px)",
            transform: "rotateX(75deg)",
            animation: "spin 4s linear infinite",
          }}
        />
      )}

      {/* Dyson rings for stage 5 */}
      {stage === 5 && (
        <>
          <div className="absolute rounded-full pointer-events-none" style={{
            width: 340, height: 340,
            border: "2px solid rgba(255,200,50,0.3)",
            animation: "spin 8s linear infinite",
          }} />
          <div className="absolute rounded-full pointer-events-none" style={{
            width: 360, height: 360,
            border: "1px solid rgba(255,200,50,0.15)",
            animation: "spin 12s linear infinite reverse",
          }} />
        </>
      )}

      {/* Planet sphere */}
      <div
        onClick={onClick}
        className="relative rounded-full cursor-pointer select-none"
        style={{
          width: 240,
          height: 240,
          background: v.base,
          boxShadow: `${v.shadow}, ${v.glow}`,
          transform: pulse ? "scale(0.96)" : "scale(1)",
          transition: "transform 0.08s ease, background 1.2s ease, box-shadow 1.2s ease",
          zIndex: 10,
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: v.overlay, transition: "background 1.2s ease" }}
        />

        {/* Rotating cloud / surface layer */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
          style={{ animation: stage === 6 ? "none" : "rotateSurface 20s linear infinite" }}
        >
          {stage < 6 && (
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `
                radial-gradient(ellipse 80px 30px at 40% 35%, ${v.cloudColor} 0%, transparent 100%),
                radial-gradient(ellipse 60px 20px at 70% 55%, ${v.cloudColor} 0%, transparent 100%),
                radial-gradient(ellipse 90px 25px at 25% 65%, ${v.cloudColor} 0%, transparent 100%),
                radial-gradient(ellipse 50px 15px at 60% 80%, ${v.cloudColor} 0%, transparent 100%)
              `,
              transition: "background 1.2s ease",
            }} />
          )}
        </div>

        {/* Lava cracks for volcanic stage */}
        {stage === 1 && (
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{
            background: `
              repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,100,0,0.1) 21px, transparent 22px),
              repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(255,60,0,0.08) 16px, transparent 17px)
            `,
          }} />
        )}

        {/* City lights for civilized stage */}
        {stage === 5 && (
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{
            background: `
              radial-gradient(circle 3px at 35% 45%, rgba(255,220,100,0.9) 0%, transparent 100%),
              radial-gradient(circle 2px at 55% 60%, rgba(255,220,100,0.8) 0%, transparent 100%),
              radial-gradient(circle 4px at 70% 40%, rgba(255,220,100,0.7) 0%, transparent 100%),
              radial-gradient(circle 2px at 25% 65%, rgba(255,220,100,0.6) 0%, transparent 100%),
              radial-gradient(circle 3px at 60% 25%, rgba(255,220,100,0.8) 0%, transparent 100%),
              radial-gradient(circle 2px at 45% 75%, rgba(255,220,100,0.5) 0%, transparent 100%),
              radial-gradient(circle 2px at 80% 65%, rgba(255,220,100,0.7) 0%, transparent 100%),
              radial-gradient(circle 3px at 15% 40%, rgba(255,220,100,0.6) 0%, transparent 100%)
            `,
          }} />
        )}

        {/* Star corona pulsing for stellar stage */}
        {stage === 6 && (
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,200,0.4) 0%, transparent 70%)",
            animation: "pulse 2s ease-in-out infinite",
          }} />
        )}
      </div>
    </div>
  )
}

// ─── Stars background ─────────────────────────────────────────────────────────

function Stars() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 3 + 2,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Main Game ────────────────────────────────────────────────────────────────

export default function NebulaCraft() {
  const [stardust, setStardust] = useState(0)
  const [totalStardust, setTotalStardust] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [producers, setProducers] = useState<Producer[]>(INITIAL_PRODUCERS)
  const [clickUpgrades, setClickUpgrades] = useState<ClickUpgrade[]>(INITIAL_CLICK_UPGRADES)
  const [particles, setParticles] = useState<Particle[]>([])
  const [pulse, setPulse] = useState(false)
  const [tab, setTab] = useState<"producers" | "upgrades">("producers")
  const [showShop, setShowShop] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [gems, setGems] = useState(0)
  const [username, setUsername] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("")

  // Achievements state
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [toastAchievement, setToastAchievement] = useState<{ id: string; name: string; icon: string; description: string } | null>(null)
  const [totalClicks, setTotalClicks] = useState(0)
  const [totalMinutesPlayed, setTotalMinutesPlayed] = useState(0)

  // Prestige
  const [prestigeLevel, setPrestigeLevel] = useState(0)
  const [showSingularity, setShowSingularity] = useState(false)
  const singularityShownRef = useRef(false)

  // Active boosts (timed): stored as end-timestamps (ms)
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoosts>({ click: null, farm: null })

  const particleId = useRef(0)

  const stage = STAGES.findLastIndex((s) => totalStardust >= s.threshold)
  const currentStage = Math.max(0, stage)

  // Prestige multiplier applied to base click power and production
  const prestigeMultiplier = 1 + prestigeLevel * 0.5

  const perSecond = producers.reduce((sum, p) => sum + p.baseProduction * p.count, 0)

  // ─── Load from localStorage ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nebulacraft")
      if (saved) {
        const data = JSON.parse(saved)
        setStardust(data.stardust ?? 0)
        setTotalStardust(data.totalStardust ?? 0)
        setClickPower(data.clickPower ?? 1)
        setGems(data.gems ?? 0)
        setTotalClicks(data.totalClicks ?? 0)
        setTotalMinutesPlayed(data.totalMinutesPlayed ?? 0)
        setUnlockedAchievements(data.unlockedAchievements ?? [])
        if (data.producers) setProducers(data.producers)
        if (data.clickUpgrades) setClickUpgrades(data.clickUpgrades)

        // Restore timed boosts — check if they're still valid
        const now = Date.now()
        const restoredBoosts: ActiveBoosts = { click: null, farm: null }
        if (data.boostEndClick && data.boostEndClick > now) {
          restoredBoosts.click = data.boostEndClick
        }
        if (data.boostEndFarm && data.boostEndFarm > now) {
          restoredBoosts.farm = data.boostEndFarm
        }
        setActiveBoosts(restoredBoosts)
      }

      // Prestige is stored separately so it survives resets
      const p = localStorage.getItem("nc_prestige")
      if (p) setPrestigeLevel(JSON.parse(p))

      // Offline username
      const u = localStorage.getItem("nc_user")
      if (u) {
        try {
          const parsed = JSON.parse(u)
          setUsername(parsed.username ?? parsed)
        } catch {
          setUsername(u)
        }
      }
    } catch {}
  }, [])

  // ─── Save to localStorage ──────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem("nebulacraft", JSON.stringify({
        stardust,
        totalStardust,
        clickPower,
        gems,
        producers,
        clickUpgrades,
        totalClicks,
        totalMinutesPlayed,
        unlockedAchievements,
        boostEndClick: activeBoosts.click,
        boostEndFarm: activeBoosts.farm,
      }))
    }, 2000)
    return () => clearTimeout(t)
  }, [stardust, totalStardust, clickPower, gems, producers, clickUpgrades, totalClicks, totalMinutesPlayed, unlockedAchievements, activeBoosts])

  // ─── Track played minutes (every 60 seconds) ───────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalMinutesPlayed(m => m + 1)
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  // ─── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (perSecond === 0) return
    const farmActive = activeBoosts.farm !== null && activeBoosts.farm > Date.now()
    const effectivePPS = perSecond * (farmActive ? 5 : 1) * prestigeMultiplier
    const interval = setInterval(() => {
      const tick = effectivePPS / 20
      setStardust((s) => s + tick)
      setTotalStardust((t) => t + tick)
    }, 50)
    return () => clearInterval(interval)
  }, [perSecond, activeBoosts, prestigeMultiplier])

  // ─── Boost expiry watcher ──────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setActiveBoosts(prev => {
        const next = { ...prev }
        let changed = false
        if (prev.click !== null && prev.click <= now) { next.click = null; changed = true }
        if (prev.farm !== null && prev.farm <= now) { next.farm = null; changed = true }
        return changed ? next : prev
      })
    }, 5_000)
    return () => clearInterval(interval)
  }, [])

  // ─── Singularity detection ─────────────────────────────────────────────────
  useEffect(() => {
    if (currentStage >= 7 && !singularityShownRef.current) {
      singularityShownRef.current = true
      setShowSingularity(true)
    }
  }, [currentStage])

  // ─── Achievement checker ───────────────────────────────────────────────────
  useEffect(() => {
    const totalProducers = producers.reduce((sum, p) => sum + p.count, 0)
    const stats: AchievementStats = {
      totalClicks,
      totalStardust,
      totalProducers,
      currentStage,
      minutesPlayed: totalMinutesPlayed,
    }

    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedAchievements.includes(achievement.id) && achievement.check(stats)) {
        setUnlockedAchievements(prev => [...prev, achievement.id])
        setToastAchievement({ id: achievement.id, name: achievement.name, icon: achievement.icon, description: achievement.description })
      }
    }
  }, [totalClicks, totalStardust, producers, currentStage, totalMinutesPlayed, unlockedAchievements])

  // ─── Click ─────────────────────────────────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent) => {
    const clickActive = activeBoosts.click !== null && activeBoosts.click > Date.now()
    const earned = clickPower * (clickActive ? 10 : 1) * prestigeMultiplier
    setStardust((s) => s + earned)
    setTotalStardust((t) => t + earned)
    setTotalClicks((c) => c + 1)
    setPulse(true)
    setTimeout(() => setPulse(false), 100)

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = ++particleId.current
    setParticles((prev) => [
      ...prev.slice(-20),
      { id, x, y, vx: (Math.random() - 0.5) * 60, vy: -40 - Math.random() * 40, life: 1, value: `+${fmt(earned)}` },
    ])
    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 900)
  }, [clickPower, activeBoosts, prestigeMultiplier])

  // ─── Buy producer ──────────────────────────────────────────────────────────
  const buyProducer = useCallback((id: string) => {
    setProducers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const cost = producerCost(p.baseCost, p.count)
        if (stardust < cost) return p
        setStardust((s) => s - cost)
        return { ...p, count: p.count + 1 }
      })
    )
  }, [stardust])

  // ─── Buy click upgrade ─────────────────────────────────────────────────────
  const buyClickUpgrade = useCallback((id: string) => {
    setClickUpgrades((prev) =>
      prev.map((u) => {
        if (u.id !== id || u.bought || stardust < u.cost) return u
        setStardust((s) => s - u.cost)
        setClickPower((cp) => cp * u.multiplier)
        return { ...u, bought: true }
      })
    )
  }, [stardust])

  // ─── Reset ─────────────────────────────────────────────────────────────────
  const resetGame = () => {
    if (!confirm("¿Resetear todo el progreso?")) return
    localStorage.removeItem("nebulacraft")
    setStardust(0); setTotalStardust(0); setClickPower(1); setGems(0)
    setTotalClicks(0); setTotalMinutesPlayed(0)
    setProducers(INITIAL_PRODUCERS); setClickUpgrades(INITIAL_CLICK_UPGRADES)
    setActiveBoosts({ click: null, farm: null })
    singularityShownRef.current = false
    setShowSingularity(false)
  }

  // ─── Prestige ──────────────────────────────────────────────────────────────
  const handlePrestige = () => {
    const newLevel = prestigeLevel + 1
    setPrestigeLevel(newLevel)
    localStorage.setItem("nc_prestige", JSON.stringify(newLevel))
    // Reset gameplay but keep gems and achievements
    localStorage.removeItem("nebulacraft")
    setStardust(0); setTotalStardust(0); setClickPower(1)
    setTotalClicks(0); setTotalMinutesPlayed(0)
    setProducers(INITIAL_PRODUCERS); setClickUpgrades(INITIAL_CLICK_UPGRADES)
    setActiveBoosts({ click: null, farm: null })
    singularityShownRef.current = false
    setShowSingularity(false)
  }

  // ─── Shop handlers ─────────────────────────────────────────────────────────
  const handleBuyPack = (pack: typeof GEM_PACKS[0]) => {
    setGems(g => g + pack.gems + pack.bonus)
  }

  const handleBuyBoost = (boost: typeof GEM_BOOSTS[0]) => {
    if (gems < boost.cost) return
    setGems(g => g - boost.cost)

    if (boost.effect === "instant") {
      setStardust(s => s + 10_000)
    }
    if (boost.effect === "timeskip") {
      const hours8 = perSecond * 8 * 3600
      setStardust(s => s + hours8)
      setTotalStardust(t => t + hours8)
    }
    if (boost.effect === "click") {
      const endTime = Date.now() + 3_600_000 // 1 hour
      setActiveBoosts(prev => ({ ...prev, click: endTime }))
    }
    if (boost.effect === "farm") {
      const endTime = Date.now() + 3_600_000 // 1 hour
      setActiveBoosts(prev => ({ ...prev, farm: endTime }))
    }
  }

  // ─── Username handlers ─────────────────────────────────────────────────────
  const saveName = () => {
    const name = nameInput.trim() || "Explorador"
    setUsername(name)
    localStorage.setItem("nc_user", JSON.stringify({ username: name }))
    setEditingName(false)
  }

  const stageData = STAGES[currentStage]

  // Active boost indicators
  const clickBoostActive = activeBoosts.click !== null && activeBoosts.click > Date.now()
  const farmBoostActive = activeBoosts.farm !== null && activeBoosts.farm > Date.now()

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#030008] flex flex-col">
      <Stars />

      {/* CSS animations */}
      <style>{`
        @keyframes rotateSurface { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin { from { transform: rotateX(75deg) rotate(0deg); } to { transform: rotateX(75deg) rotate(360deg); } }
        @keyframes twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes floatUp { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-60px); } }
        @keyframes stageIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .stage-enter { animation: stageIn 0.6s ease forwards; }
      `}</style>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-sm gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-2xl">🌌</span>
          <h1 className="text-xl font-bold tracking-widest text-white/90">NEBULACRAFT</h1>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-300">✨ {fmt(stardust)}</div>
          <div className="text-xs text-white/50">polvo estelar</div>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-white/50">{fmt(perSecond)}/s · +{fmt(clickPower)}/clic</div>
            {prestigeLevel > 0 && <div className="text-xs text-yellow-400">✦ Prestigio {prestigeLevel} (×{(1 + prestigeLevel * 0.5).toFixed(1)})</div>}
          </div>

          {/* Active boost indicators */}
          {clickBoostActive && (
            <span className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 rounded-lg px-2 py-1">⚡ Turbo activo</span>
          )}
          {farmBoostActive && (
            <span className="text-xs bg-green-500/20 border border-green-500/40 text-green-300 rounded-lg px-2 py-1">🤖 Farm activo</span>
          )}

          {/* Gems */}
          <button onClick={() => setShowShop(true)}
            className="flex items-center gap-1.5 bg-purple-900/60 border border-purple-500/40 rounded-xl px-3 py-1.5 hover:bg-purple-800/60 transition-colors">
            <span className="text-base">💎</span>
            <span className="text-sm font-bold text-purple-300">{gems}</span>
          </button>

          {/* Shop */}
          <button onClick={() => setShowShop(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">
            🛒 Tienda
          </button>

          {/* Achievements */}
          <button onClick={() => setShowAchievements(true)}
            className="text-xs border border-white/20 rounded-xl px-3 py-2 text-white/60 hover:text-white hover:border-white/40 transition-colors">
            🏆 {unlockedAchievements.length}/{ACHIEVEMENTS.length}
          </button>

          {/* Offline user */}
          {editingName ? (
            <div className="flex items-center gap-1">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false) }}
                placeholder="Tu nombre"
                maxLength={20}
                autoFocus
                className="text-xs bg-white/10 border border-purple-500/40 rounded-lg px-2 py-1 text-white placeholder-white/30 focus:outline-none w-28"
              />
              <button onClick={saveName} className="text-xs text-green-400 hover:text-green-300">✓</button>
            </div>
          ) : username ? (
            <button onClick={() => { setNameInput(username); setEditingName(true) }}
              className="text-xs text-white/40 hover:text-white/70 transition-colors">
              👤 {username}
            </button>
          ) : (
            <button onClick={() => { setNameInput(""); setEditingName(true) }}
              className="text-xs text-white/60 hover:text-white transition-colors border border-white/20 rounded-lg px-2 py-1">
              👤 Modo offline
            </button>
          )}

          <button onClick={resetGame} className="text-xs text-white/20 hover:text-red-400 transition-colors">reset</button>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* Left — Planet */}
        <div className="flex flex-col items-center justify-center flex-1 gap-6 relative">

          {/* Stage badge */}
          <div key={currentStage} className="stage-enter text-center">
            <div className="text-3xl mb-1">{stageData.emoji}</div>
            <div className="text-lg font-bold text-white tracking-wide">{stageData.name}</div>
            <div className="text-xs text-white/40 mt-1 max-w-xs text-center">{stageData.label}</div>
          </div>

          {/* Planet */}
          <div className="relative">
            <Planet stage={currentStage} onClick={handleClick} pulse={pulse} />

            {/* Click particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute pointer-events-none font-bold text-yellow-300 text-sm"
                style={{
                  left: p.x + p.vx * 0.3,
                  top: p.y - 20,
                  animation: "floatUp 0.9s ease-out forwards",
                  textShadow: "0 0 8px rgba(255,220,0,0.8)",
                }}
              >
                {p.value}
              </div>
            ))}
          </div>

          <p className="text-white/30 text-sm animate-pulse">haz clic en el planeta</p>

          {/* Next stage progress */}
          {currentStage < STAGES.length - 1 && (
            <div className="w-64">
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>Siguiente: {STAGES[currentStage + 1].name}</span>
                <span>{fmt(totalStardust)} / {fmt(STAGES[currentStage + 1].threshold)}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (totalStardust - stageData.threshold) / (STAGES[currentStage + 1].threshold - stageData.threshold) * 100)}%`,
                    background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Singularity reached — show teaser link if already passed prestige screen */}
          {currentStage >= 7 && !showSingularity && (
            <button
              onClick={() => setShowSingularity(true)}
              className="text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-xl px-4 py-2 transition-colors"
            >
              ✦ Ver pantalla de Singularidad
            </button>
          )}
        </div>

        {/* Right — Shop */}
        <div className="w-80 flex flex-col border-l border-white/10 bg-black/50 backdrop-blur-sm">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setTab("producers")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "producers" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-white/40 hover:text-white/70"}`}
            >
              Productores
            </button>
            <button
              onClick={() => setTab("upgrades")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "upgrades" ? "text-purple-400 border-b-2 border-purple-400" : "text-white/40 hover:text-white/70"}`}
            >
              Mejoras de clic
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {tab === "producers" && (
              <div className="p-3 space-y-2">
                {producers.map((p) => {
                  const cost = producerCost(p.baseCost, p.count)
                  const canAfford = stardust >= cost
                  return (
                    <button
                      key={p.id}
                      onClick={() => buyProducer(p.id)}
                      disabled={!canAfford}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        canAfford
                          ? "border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400"
                          : "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-2xl">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white truncate">{p.name}</span>
                          <span className="text-xs font-bold text-cyan-400 ml-2 shrink-0">{p.count > 0 ? `×${p.count}` : ""}</span>
                        </div>
                        <div className="text-xs text-white/50">{p.description}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-yellow-300">✨{fmt(cost)}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {tab === "upgrades" && (
              <div className="p-3 space-y-2">
                {clickUpgrades.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => buyClickUpgrade(u.id)}
                    disabled={u.bought || stardust < u.cost}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      u.bought
                        ? "border-purple-500/20 bg-purple-500/5 opacity-50 cursor-not-allowed"
                        : stardust >= u.cost
                        ? "border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400"
                        : "border-white/5 bg-white/5 opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-2xl">{u.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-white/50">{u.description}</div>
                    </div>
                    <div className="text-right shrink-0">
                      {u.bought ? (
                        <span className="text-xs text-purple-400">✓ Activo</span>
                      ) : (
                        <div className="text-xs font-bold text-yellow-300">✨{fmt(u.cost)}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stage list */}
          <div className="border-t border-white/10 p-3">
            <div className="text-xs text-white/30 mb-2 uppercase tracking-widest">Evolución del planeta</div>
            <div className="space-y-1">
              {STAGES.map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs py-0.5 ${i === currentStage ? "text-white" : i < currentStage ? "text-white/40 line-through" : "text-white/20"}`}>
                  <span>{s.emoji}</span>
                  <span>{s.name}</span>
                  {i > currentStage && <span className="ml-auto text-white/20">{fmt(s.threshold)}</span>}
                  {i === currentStage && <span className="ml-auto text-cyan-400">← actual</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shop modal */}
      {showShop && (
        <ShopModal
          gems={gems}
          activeBoosts={activeBoosts}
          onClose={() => setShowShop(false)}
          onBuyPack={handleBuyPack}
          onBuyBoost={handleBuyBoost}
        />
      )}

      {/* Achievements panel */}
      {showAchievements && (
        <AchievementsPanel
          unlocked={unlockedAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Achievement toast */}
      {toastAchievement && (
        <AchievementToast
          achievement={toastAchievement}
          onDone={() => setToastAchievement(null)}
        />
      )}

      {/* Singularity / Prestige screen */}
      {showSingularity && (
        <SingularityScreen
          prestigeLevel={prestigeLevel}
          onPrestige={handlePrestige}
        />
      )}
    </div>
  )
}
