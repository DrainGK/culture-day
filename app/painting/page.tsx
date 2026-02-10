"use client"

import { Suspense, useMemo, useState } from "react"
import { Gallery } from "@/components/gallery"
import paintingsData from "@/data/paintings.json"
import { Theater, Palette, Search, BookMarked, Landmark, User } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { name: "All", icon: Search },
  { name: "painting", icon: Palette },
  { name: "music", icon: BookMarked },
  { name: "literature", icon: BookMarked },
  { name: "cinema", icon: Theater },
  { name: "architecture", icon: Landmark },
  { name: "sculpture", icon: User },
]

function PaintingGallery({ items }: { items: any[] }) {
  return <Gallery items={items} type="painting" />
  // ⚠️ si Gallery refiltre par type, remplace par: type="all" ou supprime prop
}

export default function PaintingPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    return selectedCategory === "All"
      ? paintingsData
      : paintingsData.filter((item: any) => item.category === selectedCategory)
  }, [selectedCategory])

  const selected = useMemo(() => {
    return paintingsData.find((i: any) => i.id === selectedItem) ?? null
  }, [selectedItem])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Iconic Art
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Masterpieces from French art history that capture the essence of revolutionary ideas and cultural movements.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            )
          })}
        </div>

        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <PaintingGallery items={filteredItems} />
        </Suspense>
      </div>
    </div>
  )
}
