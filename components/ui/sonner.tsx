"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        theme === "dark"
          ? {
              background: "#23264a",
              color: "#fff",
            }
          : {
              background: "#e0f7fa",
              color: "#0f172a",
            }
      }
      {...props}
    />
  )
}

export { Toaster }
