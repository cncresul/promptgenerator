"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

const EXAMPLE_CATEGORIES = [
  {
    name: "İçerik Oluşturma",
    examples: [
      "Bir e-ticaret sitesi için ürün açıklamaları yazmak istiyorum",
      "Sosyal medya için ilgi çekici paylaşımlar oluşturmak istiyorum",
      "Bir blog için SEO dostu makaleler yazmak istiyorum",
    ],
  },
  {
    name: "Yaratıcı Yazı",
    examples: [
      "Bilim kurgu türünde kısa bir hikaye yazmak istiyorum",
      "Bir karakterin iç dünyasını anlatan derin bir monolog yazmak istiyorum",
      "Doğa temalı şiirler yazmak istiyorum",
    ],
  },
  {
    name: "İş ve Eğitim",
    examples: [
      "Bir iş başvurusu için etkileyici bir motivasyon mektubu yazmak istiyorum",
      "Karmaşık bir konuyu basit şekilde açıklayan bir eğitim içeriği oluşturmak istiyorum",
      "Bir proje teklifi hazırlamak istiyorum",
    ],
  },
]

interface PromptExamplesProps {
  onSelect: (example: string) => void
}

export const PromptExamples = ({ onSelect }: PromptExamplesProps) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (example: string) => {
    onSelect(example)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Örnekler</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Örnek Konular</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          <div className="space-y-6 pr-4">
            {EXAMPLE_CATEGORIES.map((category) => (
              <div key={category.name}>
                <h3 className="font-medium mb-2">{category.name}</h3>
                <div className="space-y-2">
                  {category.examples.map((example, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-accent" onClick={() => handleSelect(example)}>
                      <CardContent className="p-3">
                        <p className="text-sm">{example}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

