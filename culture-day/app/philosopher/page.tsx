import { Suspense } from "react"
import { Gallery } from "@/components/gallery"
import philosophersData from "@/data/philosophers.json"

function PhilosopherGallery() {
  return (
    <Gallery
      items={philosophersData}
      type="philosopher"
    />
  )
}

export default function PhilosopherPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            French Philosophers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the great minds that shaped French philosophical thought from the Renaissance to the modern era.
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <PhilosopherGallery />
        </Suspense>
      </div>
    </div>
  )
}
