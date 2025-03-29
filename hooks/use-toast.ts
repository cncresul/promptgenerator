"use client"

import { useState } from "react"

interface Toast {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (toast: Toast) => {
    // Gerçek uygulamada, bu işlev bir toast bileşenini gösterecektir
    // Şimdilik sadece konsola yazdıralım
    console.log(`Toast: ${toast.title} - ${toast.description || ""}`)

    // Gerçek uygulamada, toasts dizisine ekleyip bir süre sonra kaldıracağız
    setToasts((prev) => [...prev, toast])

    // Tarayıcı uyarısı olarak gösterelim (geçici çözüm)
    alert(`${toast.title}\n${toast.description || ""}`)
  }

  return { toast, toasts }
}

