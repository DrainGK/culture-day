"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { GalleryCard } from "./gallery-card"
import { Modal, PhilosopherModalContent, PaintingModalContent, LocationModalContent } from "./modal"

interface GalleryItem {
  id: string
  name: string
  image: string
  [key: string]: unknown
}

interface GalleryProps<T extends GalleryItem> {
  items: T[]
  type: "philosopher" | "painting" | "location"
  onSelect?: (id: string) => void
}

export function Gallery<T extends GalleryItem>({ items, type }: GalleryProps<T>) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const selectedId = searchParams.get("id")
  const selectedItem = items.find((item) => item.id === selectedId)

  const handleCardClick = (id: string) => {
    router.push(`${pathname}?id=${id}`, { scroll: false })
  }

  const handleCloseModal = () => {
    router.push(pathname, { scroll: false })
  }

  const renderModalContent = () => {
    if (!selectedItem) return null

    switch (type) {
      case "philosopher":
        return (
          <PhilosopherModalContent
            philosopher={selectedItem as unknown as {
              id: string
              name: string
              birth: string
              work: string
              quote: string
              "fun-desc": string
              image: string
            }}
          />
        )
      case "painting":
        return (
          <PaintingModalContent
            painting={selectedItem as unknown as {
              id: string
              name: string
              artist: string
              year: string
              description: string
              image: string
            }}
          />
        )
      case "location":
        return (
          <LocationModalContent
            location={selectedItem as unknown as {
              id: string
              name: string
              location: string
              description: string
              image: string
            }}
          />
        )
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-6 justify-center">
        {items.map((item) => (
          <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-16px)]">
            <GalleryCard
              id={item.id}
              name={item.name}
              image={item.image}
              onClick={() => handleCardClick(item.id)}
            />
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedItem} onClose={handleCloseModal}>
        {renderModalContent()}
      </Modal>
    </>
  )
}
