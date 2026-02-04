"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"

interface GalleryCardProps {
  id: string
  name: string
  image: string
  onClick: () => void
}

function StaggeredTitle({ text, isVisible }: { text: string; isVisible: boolean }) {
  const letters = text.split("")

  return (
    <span className="inline-flex flex-wrap justify-center">
      <AnimatePresence>
        {isVisible && letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.25,
              delay: index * 0.025,
              ease: "easeOut"
            }}
            className="inline-block"
            style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}

export function GalleryCard({ id, name, image, onClick }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layoutId={`card-${id}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-card border border-border"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="absolute inset-0 transition-all duration-500 group-hover:grayscale">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Title - Animated from bottom */}
      <motion.div 
        className="absolute inset-x-0 bottom-0 p-4"
        initial={{ y: "100%" }}
        animate={{ y: isHovered ? 0 : "100%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h3 className="text-lg font-heading font-bold text-white text-center min-h-[1.75rem]">
          <StaggeredTitle text={name} isVisible={isHovered} />
        </h3>
      </motion.div>

      {/* Shadow effect */}
      <motion.div 
        className="absolute inset-0 shadow-[inset_0_-60px_60px_-60px_rgba(0,0,0,0.5)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  )
}
