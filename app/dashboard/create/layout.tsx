import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create - Supernova Studio",
  description: "Generate viral content in seconds with AI-powered tools",
}

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
