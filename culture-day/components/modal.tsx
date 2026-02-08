"use client"

import React from "react"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import Image from "next/image"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Handle backdrop click - only close when clicking directly on backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop - clicking this closes modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={handleBackdropClick}
          />

          {/* Modal Content - clicking inside does NOT close */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto bg-card rounded-2xl border border-border shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-background/80 backdrop-blur-sm hover:bg-secondary transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface PhilosopherModalContentProps {
  philosopher: {
    id: string
    name: string
    birth: string
    work: string
    quote: string
    "fun-desc": string
    image: string
  }
}

export function PhilosopherModalContent({ philosopher }: PhilosopherModalContentProps) {
  return (
    <div>
      <div className="relative aspect-video">
        <Image
          src={philosopher.image || "/placeholder.svg"}
          alt={philosopher.name}
          fill
          className="object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>
      <div className="p-6 -mt-12 relative">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-1">
          {philosopher.name}
        </h2>
        <p className="text-muted-foreground mb-4">{philosopher.birth}</p>

        <blockquote className="border-l-4 border-accent pl-4 italic text-foreground mb-6">
          &ldquo;{philosopher.quote}&rdquo;
        </blockquote>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Major Works</h3>
            <p className="text-muted-foreground">{philosopher.work}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Fun Fact</h3>
            <p className="text-muted-foreground">{philosopher["fun-desc"]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PaintingModalContentProps {
  painting: {
    id: string
    name: string
    artist: string
    year: string
    description: string
    image: string
  }
}

export function PaintingModalContent({ painting }: PaintingModalContentProps) {
  return (
    <div>
      <div className="relative aspect-video">
        <Image
          src={painting.image || "/placeholder.svg"}
          alt={painting.name}
          fill
          className="object-cover rounded-t-2xl"
        />
      </div>
      <div className="p-6">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-1">
          {painting.name}
        </h2>
        <p className="text-muted-foreground mb-4">
          {painting.artist}, {painting.year}
        </p>
        <p className="text-foreground">{painting.description}</p>
      </div>
    </div>
  )
}

interface LocationModalContentProps {
  location: {
    id: string
    name: string
    location: string
    description: string
    image: string
  }
}

export function LocationModalContent({ location }: LocationModalContentProps) {
  return (
    <div>
      <div className="relative aspect-video">
        <Image
          src={location.image || "/placeholder.svg"}
          alt={location.name}
          fill
          className="object-cover rounded-t-2xl"
        />
      </div>
      <div className="p-6">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-1">
          {location.name}
        </h2>
        <p className="text-muted-foreground mb-4">{location.location}</p>
        <p className="text-foreground">{location.description}</p>
      </div>
    </div>
  )
}

interface InnovationModalContentProps {
  innovation: {
    id: string
    name: string
    date?: string
    innovator?: string
    description: string
    image: string

    // optional enrichments
    context?: string
    consequences?: string
    anecdote?: string

    // other fields your data may have
    category?: string
    century?: string
    // milestones?: string[] // or whatever it is
}
}

export function InnovationModalContent({ innovation }: InnovationModalContentProps) {
  return (
    <div>
      <div className="relative aspect-video">
        <Image
          src={innovation.image || "/placeholder.svg"}
          alt={innovation.name}
          fill
          className="object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>
      <div className="p-6 -mt-12 relative">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {innovation.date}
          </span>
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-1">
          {innovation.name}
        </h2>
        <p className="text-muted-foreground mb-4">{innovation.innovator}</p>

        <p className="text-foreground mb-6">{innovation.description}</p>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Historical Context</h3>
            <p className="text-muted-foreground">{innovation.context}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Impact & Consequences</h3>
            <p className="text-muted-foreground">{innovation.consequences}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-primary mb-1">Fun Fact</h3>
            <p className="text-muted-foreground italic">{innovation.anecdote}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LeaderModalContentProps {
  leader: {
    id: string
    name: string
    birth: string
    role: string
    achievements: string
    legacy: string
    quote: string
    "fun-desc": string
    image: string
  }
}

export function LeaderModalContent({ leader }: LeaderModalContentProps) {
  return (
    <div>
      <div className="relative aspect-video">
        <Image
          src={leader.image || "/placeholder.svg"}
          alt={leader.name}
          fill
          className="object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>
      <div className="p-6 -mt-12 relative">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-1">
          {leader.name}
        </h2>
        <p className="text-sm text-primary font-medium mb-1">{leader.role}</p>
        <p className="text-muted-foreground mb-4">{leader.birth}</p>

        {leader.quote && (
          <blockquote className="border-l-4 border-accent pl-4 italic text-foreground mb-6">
            &ldquo;{leader.quote}&rdquo;
          </blockquote>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Key Achievements</h3>
            <p className="text-muted-foreground">{leader.achievements}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Legacy</h3>
            <p className="text-muted-foreground">{leader.legacy}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">Fun Fact</h3>
            <p className="text-muted-foreground">{leader["fun-desc"]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
