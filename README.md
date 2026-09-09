<div align="center">

# 🚀 NebulaCraft

**Space incremental game — evoluciona tu planeta hasta la singularidad**

[![Live Demo](https://img.shields.io/badge/Demo-Live-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://github.com/DarioSanchez99/nebulacraft)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## ¿Qué es NebulaCraft?

NebulaCraft es un **juego incremental** (cookie clicker) ambientado en el espacio. El objetivo es simple: haz clic, acumula recursos cósmicos y evoluciona tu planeta a través de distintas eras hasta alcanzar la singularidad.

Cada mejora desbloquea nuevas mecánicas, mundos y posibilidades. La partida nunca termina — siempre hay un siguiente paso.

---

## Mecánicas principales

- **Click to collect** — genera energía cósmica con cada clic
- **Mejoras automáticas** — instala generadores que producen recursos pasivamente
- **Evolución planetaria** — avanza por eras: Primitiva → Industrial → Digital → Galáctica → Singularidad
- **Árbol de tecnologías** — desbloquea upgrades que multiplican tu producción
- **Eventos aleatorios** — asteroides, supernovas y anomalías que afectan al juego

---

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui |
| Estado | Custom hooks + localStorage |
| CI/CD | GitHub Actions |

---

## Estructura del proyecto

```
nebulacraft/
├── app/
│   ├── layout.tsx          # Layout global
│   └── page.tsx            # Pantalla principal del juego
├── components/
│   ├── Planet.tsx           # Componente del planeta clickeable
│   ├── ResourceBar.tsx      # Barra de recursos
│   ├── UpgradePanel.tsx     # Panel de mejoras
│   └── EraProgress.tsx      # Progreso de evolución
├── hooks/
│   ├── useGame.ts           # Lógica principal del juego
│   └── useAutoSave.ts       # Auto-guardado en localStorage
├── lib/
│   └── gameConfig.ts        # Configuración de eras, upgrades y multiplicadores
└── public/
    └── assets/              # Sprites y fondos del espacio
```

---

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/DarioSanchez99/nebulacraft.git
cd nebulacraft

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Build y deploy

```bash
# Build de producción
npm run build

# Preview local
npm start
```

El proyecto incluye un workflow de GitHub Actions para deploy automático.

---

## Roadmap

- [ ] Sistema de logros y achievements
- [ ] Modo prestige (reinicio con bonificaciones)
- [ ] Multijugador asíncrono (comparar progreso)
- [ ] Sonidos y música de fondo
- [ ] PWA (instalable en móvil)

---

<div align="center">

Made with ☕ and TypeScript · [DarioSanchez99](https://github.com/DarioSanchez99)

</div>
