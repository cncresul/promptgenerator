"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Copy, Share2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResultScreenProps {
  result: string
  onNewPrompt: () => void
}

export const ResultScreen = ({ result, onNewPrompt }: ResultScreenProps) => {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

    toast({
      title: "Kopyalandı",
      description: "Prompt panoya kopyalandı.",
    })
  }

  const handleSave = () => {
    // Gerçek uygulamada, bu işlev yanıtı yerel depolamaya kaydedecektir
    toast({
      title: "Kaydedildi",
      description: "Prompt başarıyla kaydedildi.",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Oluşturulan Prompt",
          text: result,
        })
        .catch((err) => {
          console.error("Paylaşma hatası:", err)
          toast({
            title: "Paylaşma hatası",
            description: "Prompt paylaşılırken bir hata oluştu.",
            variant: "destructive",
          })
        })
    } else {
      // Web Share API desteklenmiyorsa
      navigator.clipboard.writeText(result)
      toast({
        title: "Kopyalandı",
        description: "Paylaşım desteklenmediği için prompt panoya kopyalandı.",
      })
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Oluşturulan Detaylı Prompt</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handleCopy} title="Kopyala">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare} title="Paylaş">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSave} title="Kaydet">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="min-h-[200px] whitespace-pre-wrap text-sm">{result}</div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Bu detaylı promptu kopyalayıp ChatGPT, Claude, Gemini veya diğer AI araçlarında kullanabilirsiniz.
        </p>

        <Button onClick={onNewPrompt}>Yeni Prompt</Button>
      </div>
    </div>
  )
}

