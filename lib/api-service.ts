// API anahtarını güvenli bir şekilde saklamak için
// Gerçek uygulamada bu değer kullanıcıdan alınacak ve yerel depolamada saklanacaktır
let API_KEY = ""

export const setApiKey = (key: string) => {
  API_KEY = key
  // Gerçek uygulamada localStorage veya AsyncStorage kullanılabilir
  // localStorage.setItem('api_key', key);
}

export const getApiKey = () => {
  // Gerçek uygulamada
  // return localStorage.getItem('api_key') || "";
  return API_KEY
}

// Mevcut modelleri listeleyen fonksiyon
export const listModels = async (key: string): Promise<any> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`)
    const data = await response.json()
    console.log("Mevcut modeller:", data)
    return data
  } catch (error) {
    console.error("Modelleri listelerken hata:", error)
    throw error
  }
}

export const validateApiKey = async (key: string): Promise<boolean> => {
  try {
    // Önce mevcut modelleri listeleyelim
    const modelsData = await listModels(key)

    if (modelsData.error) {
      console.error("API anahtarı doğrulama hatası:", modelsData.error)
      return false
    }

    // Modeller başarıyla listelendiyse, API anahtarı geçerlidir
    return true
  } catch (error) {
    console.error("API doğrulama hatası:", error)
    return false
  }
}

export const sendPrompt = async (prompt: string): Promise<string> => {
  try {
    const apiKey = getApiKey()

    if (!apiKey) {
      throw new Error("API anahtarı bulunamadı. Lütfen ayarlar bölümünden API anahtarınızı ekleyin.")
    }

    // Önce mevcut modelleri listeleyelim
    const modelsData = await listModels(apiKey)

    if (modelsData.error) {
      throw new Error(`API hatası: ${modelsData.error.message || "Modeller listelenirken bir hata oluştu"}`)
    }

    // Kullanılabilir bir model bulalım
    const availableModels = modelsData.models || []
    console.log("Kullanılabilir modeller:", availableModels)

    if (availableModels.length === 0) {
      throw new Error(
        "Kullanılabilir model bulunamadı. API anahtarınızın Gemini API'ye erişim izni olduğundan emin olun.",
      )
    }

    // Tercih edilen modelleri sırayla deneyelim - gemini-1.5-flash'ı öncelikli olarak kullanalım
    const preferredModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]

    let modelToUse = null
    for (const modelName of preferredModels) {
      const foundModel = availableModels.find(
        (m: any) => m.name.includes(modelName) && !m.name.includes("vision"), // Vision modellerini hariç tutalım
      )
      if (foundModel) {
        modelToUse = foundModel.name
        break
      }
    }

    // Eğer tercih edilen modellerden hiçbiri bulunamazsa, ilk modeli kullanalım
    // Ancak "vision" içeren modelleri ve kullanımdan kaldırılmış modelleri hariç tutalım
    if (!modelToUse && availableModels.length > 0) {
      const nonVisionModels = availableModels.filter(
        (m: any) => !m.name.includes("vision") && !m.name.includes("1.0"), // 1.0 sürümlerini hariç tutalım çünkü kullanımdan kaldırılmış olabilirler
      )

      if (nonVisionModels.length > 0) {
        modelToUse = nonVisionModels[0].name
      } else {
        // Son çare olarak herhangi bir modeli kullanalım
        modelToUse = availableModels[0].name
      }
    }

    if (!modelToUse) {
      throw new Error("Kullanılabilir model bulunamadı.")
    }

    console.log(`Kullanılan model: ${modelToUse}`)

    // Modelin tam adını alalım
    const modelFullName = modelToUse.includes("/") ? modelToUse : `models/${modelToUse}`

    // API isteği gönderelim
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${modelFullName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8, // Daha yaratıcı yanıtlar için sıcaklığı artırdık
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048, // Daha uzun yanıtlar için token sayısını artırdık
          },
        }),
      },
    )

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message || "API yanıt hatası")
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("API'den yanıt alınamadı")
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("API hatası:", error)
    throw error
  }
}

// Geçmiş işlemleri için yerel depolama fonksiyonları
export interface HistoryItem {
  id: number
  prompt: string
  response?: string
  date: string
}

export const saveToHistory = (prompt: string, response: string): HistoryItem => {
  // Gerçek uygulamada localStorage veya AsyncStorage kullanılabilir
  const history = getHistory()

  const newItem: HistoryItem = {
    id: Date.now(),
    prompt,
    response,
    date: new Date().toISOString().split("T")[0],
  }

  const updatedHistory = [newItem, ...history]

  // localStorage.setItem('prompt_history', JSON.stringify(updatedHistory));

  return newItem
}

export const getHistory = (): HistoryItem[] => {
  // Gerçek uygulamada
  // const saved = localStorage.getItem('prompt_history');
  // return saved ? JSON.parse(saved) : [];

  // Şimdilik örnek veriler döndürelim
  return [
    {
      id: 1,
      prompt: "Bir yaz günü deniz kenarında geçen kısa bir hikaye yazar mısın?",
      response: "Sıcak bir yaz günüydü. Deniz, güneşin altında pırıl pırıl parlıyordu...",
      date: "2025-03-28",
    },
    {
      id: 2,
      prompt: "React ile basit bir sayaç uygulaması nasıl yapılır?",
      response: "React ile basit bir sayaç uygulaması yapmak için öncelikle useState hook'unu kullanmanız gerekir...",
      date: "2025-03-27",
    },
    {
      id: 3,
      prompt: "Yapay zeka nedir ve nasıl çalışır?",
      response:
        "Yapay zeka, insan zekasını taklit eden ve öğrenme, problem çözme gibi yeteneklere sahip bilgisayar sistemleridir...",
      date: "2025-03-26",
    },
  ]
}

