"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { Gallery } from "@/components/gallery"
import { Modal, LeaderModalContent } from "@/components/modal"
import leadersData from "@/data/leaders.json"

function LeadersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedId = searchParams.get("id")
  
  const selectedLeader = leadersData.find(l => l.id === selectedId)

  const handleSelect = (id: string) => {
    router.push(`/leaders?id=${id}`, { scroll: false })
  }

  const handleClose = () => {
    router.push("/leaders", { scroll: false })
  }

  const galleryItems = leadersData.map(leader => ({
    id: leader.id,
    name: leader.name,
    image: leader.image
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Great French Leaders
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the visionary leaders who shaped France and influenced world history through their courage, wisdom, and determination.
          </p>
        </div>

        <Gallery items={galleryItems} onSelect={handleSelect} />

        <Modal isOpen={!!selectedLeader} onClose={handleClose}>
          {selectedLeader && (
            <LeaderModalContent leader={selectedLeader} />
          )}
        </Modal>
      </div>
    </div>
  )
}

export default function LeadersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <LeadersContent />
    </Suspense>
  )
}
