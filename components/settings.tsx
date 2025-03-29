"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Moon, Sun, Info, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getApiKey, setApiKey, validateApiKey, listModels } from "@/lib/api-service"

export const Settings = () => {
  const { theme, setTheme } = useTheme()
  const [apiKey, setApiKeyState] = useState(getApiKey())
  const [notifications, setNotifications] = useState(false)
  const [validating, setValidating] = useState(false)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const { toast } = useToast()

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyState(e.target.value)
  }

  const handleValidateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API anahtarı gerekli",
        description: "Lütfen bir API anahtarı girin.",
        variant: "destructive",
      })
      return
    }

    setValidating(true)
    setAvailableModels([])

    try {
      console.log("API anahtarı doğrulanıyor:", apiKey)
      const isValid = await validateApiKey(apiKey)

      if (isValid) {
        setApiKey(apiKey)
        toast({
          title: "API anahtarı doğrulandı",
          description: "API anahtarınız başarıyla doğrulandı ve kaydedildi.",
        })

        // Kullanılabilir modelleri göster
        try {
          const modelsData = await listModels(apiKey)
          console.log("Kullanılabilir modeller:", modelsData)

          if (modelsData.models && modelsData.models.length > 0) {
            const modelNames = modelsData.models.map((m: any) => {
              const fullName = m.name
              const shortName = fullName.split("/").pop()
              return shortName
            })
            setAvailableModels(modelNames)
          }
        } catch (error) {
          console.error("Modelleri listelerken hata:", error)
        }
      } else {
        toast({
          title: "Geçersiz API anahtarı",
          description:
            "API anahtarınız doğrulanamadı. Lütfen Google AI Studio'dan aldığınız anahtarın doğru olduğundan ve Gemini API'ye erişim izni olduğundan emin olun.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Doğrulama hatası:", error)
      toast({
        title: "Doğrulama hatası",
        description: error instanceof Error ? error.message : "API anahtarı doğrulanırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-mode">Tema Modu</Label>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              id="theme-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
            <Moon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Uygulamanın görünümünü açık veya koyu mod olarak değiştirin.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-key">Google AI Studio API Anahtarı</Label>
        <div className="flex space-x-2">
          <Input
            id="api-key"
            type="password"
            placeholder="API anahtarınızı girin"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
          <Button variant="outline" size="sm" onClick={handleValidateApiKey} disabled={validating}>
            {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Doğrula"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Google AI Studio API anahtarınızı buraya girin. Bu anahtar, prompt'larınızı işlemek için kullanılacaktır.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Google AI Studio
          </a>
          'dan bir API anahtarı alabilirsiniz. API anahtarınızın Gemini API'ye erişim izni olduğundan emin olun.
        </p>

        {availableModels.length > 0 && (
          <div className="mt-4">
            <Label>Kullanılabilir Modeller</Label>
            <div className="mt-2 p-2 bg-muted rounded-md text-xs">
              <ul className="space-y-1">
                {availableModels.map((model, index) => (
                  <li key={index}>{model}</li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Uygulama, bu modellerden en uygun olanını otomatik olarak seçecektir.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Bildirimler</Label>
          <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
        </div>
        <p className="text-xs text-muted-foreground">
          Yeni özellikler ve güncellemeler hakkında bildirim almak için etkinleştirin.
        </p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Info className="h-4 w-4 mr-2" />
            Hakkında
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prompt Oluşturucu Hakkında</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Sürüm: 1.0.0</p>
            <p>
              Bu uygulama, kullanıcıların yapay zeka destekli prompt'lar oluşturmasına olanak tanır ve bu prompt'ları
              Google AI Studio API üzerinden işler.
            </p>
            <p className="text-xs text-muted-foreground">© 2025 Prompt Oluşturucu. Tüm hakları saklıdır.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

