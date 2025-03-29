import { MainScreen } from "@/components/main-screen"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="w-full max-w-md mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-4">
          Prompt Oluşturucu, fikirlerinizi detaylı, profesyonel ve etkili yapay zeka promptlarına dönüştüren güçlü bir
          araçtır.
        </p>
        <MainScreen />
        <p className="text-center text-xs text-muted-foreground mt-4">
          Oluşturulan detaylı promptları ChatGPT, Claude, Gemini veya diğer AI araçlarında kullanarak üstün sonuçlar
          elde edebilirsiniz.
        </p>
      </div>
    </main>
  )
}

