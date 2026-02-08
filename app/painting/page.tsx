import { Suspense } from "react"
import { Gallery } from "@/components/gallery"
import paintingsData from "@/data/paintings.json"

function PaintingGallery() {
  return (
    <Gallery
      items={paintingsData}
      type="painting"
    />
  )
}

export default function PaintingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Iconic Paintings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Masterpieces from French art history that capture the essence of revolutionary ideas and cultural movements.
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <PaintingGallery />
        </Suspense>
      </div>
    </div>
  )
}
