"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { getHistory, type HistoryItem } from "@/lib/api-service"
import { useState, useEffect } from "react"

interface HistoryProps {
  onSelectPrompt: (prompt: string) => void
}

export const History = ({ onSelectPrompt }: HistoryProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    // Gerçek uygulamada, bu veri yerel depolamadan gelecektir
    setHistoryItems(getHistory())
  }, [])

  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-lg font-medium">Geçmiş Prompt'lar</h2>

      {historyItems.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Henüz kaydedilmiş prompt bulunmuyor.</p>
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {historyItems.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:bg-accent">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm line-clamp-2">{item.prompt}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onSelectPrompt(item.prompt)}>
                      Kullan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

