"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { Gallery } from "@/components/gallery"
import { Modal } from "@/components/modal"
import { InnovationModalContent } from "@/components/modal"
import innovationsData from "@/data/innovations.json"

function ScienceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedId = searchParams.get("id")
  
  const selectedInnovation = innovationsData.find(i => i.id === selectedId)

  const handleSelect = (id: string) => {
    router.push(`/science?id=${id}`, { scroll: false })
  }

  const handleClose = () => {
    router.push("/science", { scroll: false })
  }

  const galleryItems = innovationsData.map(innovation => ({
    id: innovation.id,
    name: innovation.name,
    image: innovation.image
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            French Scientific Innovations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the groundbreaking inventions and discoveries that French scientists and engineers have contributed to the world.
          </p>
        </div>

        <Gallery items={galleryItems} type="painting" onSelect={handleSelect} />

        <Modal isOpen={!!selectedInnovation} onClose={handleClose}>
          {selectedInnovation && (
            <InnovationModalContent innovation={selectedInnovation} />
          )}
        </Modal>
      </div>
    </div>
  )
}

export default function SciencePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <ScienceContent />
    </Suspense>
  )
}
