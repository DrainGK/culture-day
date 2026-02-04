"use client"

import { useState } from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Map, Grid3X3, Search } from "lucide-react"
import { FranceMap } from "@/components/france-map"
import { Gallery } from "@/components/gallery"
import { Modal, LocationModalContent } from "@/components/modal"
import locationsData from "@/data/locations.json"
import { cn } from "@/lib/utils"

function LocationContent() {
  const [viewMode, setViewMode] = useState<"map" | "gallery">("map")
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedId = searchParams.get("id")
  
  const selectedLocation = locationsData.find(l => l.id === selectedId)
  const [selectedRegion, setSelectedRegion] = useState("All");
  const regions = [ ...new Set(
    locationsData
      .map(loc=>loc.region)
      .filter(Boolean)
  )];

  const handleSelect = (id: string) => {
    router.push(`/location?id=${id}`, { scroll: false })
  }

  const handleClose = () => {
    router.push("/location", { scroll: false })
  }

  const filteredItems = selectedRegion === "All"
    ? locationsData
    : locationsData.filter(item => item.region === selectedRegion)

  const galleryItems = filteredItems.map(loc => ({
    id: loc.id,
    name: loc.name,
    image: loc.image
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Famous Landmarks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover iconic places in France.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
              viewMode === "map"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-secondary"
            )}
          >
            <Map className="h-4 w-4" />
            Map View
          </button>
          <button
            onClick={() => setViewMode("gallery")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
              viewMode === "gallery"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-secondary"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            Gallery View
          </button>
        </div>

        {viewMode === "map" ? (
          <FranceMap locations={locationsData} onSelect={handleSelect} />
        ) : (
          <>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
                      <button
                        onClick={()=>setSelectedRegion("All")}
                        className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                        selectedRegion === "All"
                        ? "bg-secondary text-foreground"
                        : "bg-card border border-border text-foreground hover:bg-secondary"
                        )}
                      >
                        <Search className="h-4 w-4" />
                          All
                    </button>
                    {regions.map((region:any) => {
                      return (
                        <>
                        
                        <button
                          key={region}
                          onClick={() => setSelectedRegion(region)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                            selectedRegion === region
                              ? "bg-secondary text-foreground"
                              : "bg-card border border-border text-foreground hover:bg-secondary"
                          )}
                        >
                          {region}
                        </button>
                        </>
                      )
                    })}
                  </div>
          <Gallery items={galleryItems} onSelect={handleSelect} />
          </>
        )}

        <Modal isOpen={!!selectedLocation} onClose={handleClose}>
          {selectedLocation && (
            <LocationModalContent location={selectedLocation} />
          )}
        </Modal>
      </div>
    </div>
  )
}

export default function LocationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <LocationContent />
    </Suspense>
  )
}
