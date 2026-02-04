"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Building2, Rocket, Cpu, Zap, Search, Boxes, HeartPulse, Shield, ShoppingBag, FlaskConical, Theater } from "lucide-react"
import Image from "next/image"
import todayInnovationsData from "@/data/today-innovations.json"
import { cn } from "@/lib/utils"

const categories = [
  { name: "All", icon: Search },
  { name: "Deep Tech (AI/Cloud/Cyber/HPC)", icon: Cpu },
  { name: "Industry & Digital Engineering", icon: Boxes },
  { name: "Energy & Climate", icon: Zap },
  { name: "Health & Biotech", icon: HeartPulse },
  { name: "Mobility & Aerospace", icon: Rocket },
  { name: "Defense & Security", icon: Shield },
  { name: "Platforms & Ecosystems", icon: Building2 },
  { name: "Consumer & Retail Innovation", icon: ShoppingBag },
  { name: "Research & Frontier Science", icon: FlaskConical },
  { name: "Culture & Experience", icon: Theater },
];

export default function InnovationPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const filteredItems = selectedCategory === "All"
    ? todayInnovationsData
    : todayInnovationsData.filter(item => item.category === selectedCategory)

  const selected = todayInnovationsData.find(i => i.id === selectedItem)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            France Innovation Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the cutting-edge companies and research institutions driving innovation in France and shaping the future.
          </p>
        </div>

        {/* Category Filter */}
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

        {/* Grid */}
        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedItem(item.id)}
                className="group cursor-pointer bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto bg-card rounded-2xl border border-border shadow-2xl"
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-background/80 backdrop-blur-sm hover:bg-secondary transition-colors text-foreground"
                >
                  X
                </button>
                <div className="relative aspect-video">
                  <Image
                    src={selected.image || "/placeholder.svg"}
                    alt={selected.name}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="p-6 -mt-12 relative">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                    {selected.category}
                  </span>
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                    {selected.name}
                  </h2>
                  <p className="text-foreground mb-6">{selected.description}</p>
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-primary mb-2">Global Impact</h3>
                    <p className="text-muted-foreground">{selected.impact}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
