// ─── Achievements config ──────────────────────────────────────────────────────

export interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
  /** Returns true when this achievement should unlock given the current game stats */
  check: (stats: AchievementStats) => boolean
}

export interface AchievementStats {
  totalClicks: number
  totalStardust: number
  totalProducers: number
  currentStage: number
  minutesPlayed: number
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_click",
    name: "Primer Contacto",
    description: "Haz tu primer clic en el planeta.",
    icon: "👆",
    check: (s) => s.totalClicks >= 1,
  },
  {
    id: "clicks_100",
    name: "Explorador Curioso",
    description: "Realiza 100 clics.",
    icon: "🖱️",
    check: (s) => s.totalClicks >= 100,
  },
  {
    id: "clicks_1000",
    name: "Mano de Hierro",
    description: "Realiza 1.000 clics.",
    icon: "✊",
    check: (s) => s.totalClicks >= 1_000,
  },
  {
    id: "first_producer",
    name: "Primer Activo",
    description: "Compra tu primer productor.",
    icon: "🛰️",
    check: (s) => s.totalProducers >= 1,
  },
  {
    id: "producers_10",
    name: "Flota Creciente",
    description: "Ten 10 productores en total.",
    icon: "🚀",
    check: (s) => s.totalProducers >= 10,
  },
  {
    id: "stage_2",
    name: "Mundo Primordial",
    description: "Alcanza la etapa Mundo Primordial.",
    icon: "🌿",
    check: (s) => s.currentStage >= 2,
  },
  {
    id: "stage_5",
    name: "Ciudad Estelar",
    description: "Alcanza la etapa Mundo Civilizado.",
    icon: "🏙️",
    check: (s) => s.currentStage >= 5,
  },
  {
    id: "one_hour",
    name: "Comandante Veterano",
    description: "Juega durante 1 hora en total.",
    icon: "⏱️",
    check: (s) => s.minutesPlayed >= 60,
  },
  {
    id: "stardust_1m",
    name: "Polvo de Estrellas",
    description: "Acumula 1.000.000 de polvo estelar en total.",
    icon: "✨",
    check: (s) => s.totalStardust >= 1_000_000,
  },
  {
    id: "singularity",
    name: "Señor del Vacío",
    description: "Alcanza la Singularidad.",
    icon: "🕳️",
    check: (s) => s.currentStage >= 7,
  },
]
