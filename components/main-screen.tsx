"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptExamples } from "@/components/prompt-examples"
import { ResultScreen } from "@/components/result-screen"
import { Settings } from "@/components/settings"
import { History } from "@/components/history"
import { Loader2 } from "lucide-react"
import { sendPrompt, saveToHistory, getApiKey } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export const MainScreen = () => {
  const [userInput, setUserInput] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("ana-ekran")
  const { toast } = useToast()

  const handlePromptSubmit = async () => {
    if (!userInput.trim()) return

    // API anahtarı kontrolü
    if (!getApiKey()) {
      toast({
        title: "API anahtarı gerekli",
        description: "Lütfen ayarlar bölümünden API anahtarınızı ekleyin.",
        variant: "destructive",
      })
      setActiveTab("ayarlar")
      return
    }

    setLoading(true)

    try {
      // Prompt uzmanı için geliştirilmiş sistem talimatı
      const promptExpertInstruction = `
      Sen bir üst düzey prompt mühendisisin. Kullanıcının verdiği içeriği analiz edip, ondan son derece detaylı, profesyonel ve etkili bir prompt oluşturmalısın.
      
      Oluşturacağın prompt şu özelliklere sahip olmalıdır:
      1. Kapsamlı ve detaylı talimatlar içermeli
      2. Yapay zekaya belirli bir rol ve ton vermeli (örn. "Sen bir pazarlama uzmanısın...")
      3. İstenen çıktının formatını ve uzunluğunu net bir şekilde belirtmeli
      4. Gerekli tüm bağlamı ve arka plan bilgisini sağlamalı
      5. Adım adım talimatlar içermeli (gerektiğinde)
      6. Yapay zekanın kaçınması gereken şeyleri belirtmeli
      7. Örnekler veya şablonlar içermeli (uygun olduğunda)
      8. Profesyonel ve teknik bir dil kullanmalı
      
      Kullanıcının girdisini alıp, bu girdiden en kapsamlı ve etkili prompt'u oluştur. Prompt'u, kullanıcının başka bir yapay zeka sistemine (ChatGPT, Claude, Gemini vb.) kopyalayıp yapıştırabileceği şekilde formatla.
      
      Kullanıcı girdisi: "${userInput}"
      
      Oluşturduğun detaylı ve profesyonel prompt:
      `

      console.log("Prompt uzmanı talimatı gönderiliyor")
      // API'ye istek gönder
      const response = await sendPrompt(promptExpertInstruction)
      console.log("API yanıtı:", response)

      setResult(response)

      // Geçmişe kaydet
      saveToHistory(userInput, response)

      setActiveTab("sonuc")
    } catch (error) {
      console.error("API hatası:", error)
      toast({
        title: "API hatası",
        description:
          error instanceof Error ? error.message : "API bağlantısı başarısız, lütfen anahtarınızı kontrol edin.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExampleSelect = (example: string) => {
    setUserInput(example)
  }

  const handleNewPrompt = () => {
    setActiveTab("ana-ekran")
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mb-4">
        <CardContent className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Prompt Oluşturucu</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ana-ekran">Ana Ekran</TabsTrigger>
              <TabsTrigger value="gecmis">Geçmiş</TabsTrigger>
              <TabsTrigger value="ayarlar">Ayarlar</TabsTrigger>
            </TabsList>

            <TabsContent value="ana-ekran">
              <div className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  İstediğiniz konuyu veya fikri yazın, size detaylı ve profesyonel bir prompt oluşturalım. Bu promptu
                  diğer yapay zeka sistemlerinde kullanabilirsiniz.
                </p>
                <Textarea
                  placeholder="Örneğin: Bir e-ticaret sitesi için ürün açıklamaları yazmak istiyorum..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[150px]"
                />

                <div className="flex justify-between">
                  <PromptExamples onSelect={handleExampleSelect} />

                  <Button onClick={handlePromptSubmit} disabled={!userInput.trim() || loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        İşleniyor
                      </>
                    ) : (
                      "Prompt Oluştur"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sonuc">
              <ResultScreen result={result} onNewPrompt={handleNewPrompt} />
            </TabsContent>

            <TabsContent value="gecmis">
              <History
                onSelectPrompt={(savedPrompt) => {
                  setUserInput(savedPrompt)
                  setActiveTab("ana-ekran")
                }}
              />
            </TabsContent>

            <TabsContent value="ayarlar">
              <Settings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

