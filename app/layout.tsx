import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "NebulaCraft — Forja tu galaxia",
  description: "Haz clic. Evoluciona tu planeta. Conquista el universo.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-black text-white antialiased overflow-hidden">{children}</body>
    </html>
  )
}
