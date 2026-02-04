"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { RotateCcw, Trophy } from "lucide-react"
import Image from "next/image"
import philosophersData from "@/data/philosophers.json"

interface Player {
  id: string
  name: string
  image: string
  elo: number
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function updateElo(winner: Player, loser: Player) {
  const K = 32
  const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400))
  const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400))
  
  winner.elo = Math.round(winner.elo + K * (1 - expectedWinner))
  loser.elo = Math.round(loser.elo + K * (0 - expectedLoser))
}

export function DualQuiz() {
  const initialPlayers: Player[] = useMemo(() => 
    shuffleArray(philosophersData.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image,
      elo: 1500
    }))), []
  )
  
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [turn, setTurn] = useState(1)
  const [currentPair, setCurrentPair] = useState([0, 1])
  const maxTurns = 10

  const handleChoice = (winnerId: string) => {
    const winner = players.find(p => p.id === winnerId)!
    const loserId = players[currentPair[0]].id === winnerId 
      ? players[currentPair[1]].id 
      : players[currentPair[0]].id
    const loser = players.find(p => p.id === loserId)!

    updateElo(winner, loser)

    if (turn < maxTurns) {
      setTurn(turn + 1)
      const shuffled = shuffleArray(players)
      setPlayers(shuffled)
      setCurrentPair([0, 1])
    } else {
      setTurn(turn + 1)
    }
  }

  const handleReset = () => {
    setPlayers(shuffleArray(philosophersData.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image,
      elo: 1500
    }))))
    setTurn(1)
    setCurrentPair([0, 1])
  }

  const topPlayer = useMemo(() => {
    return players.reduce((prev, curr) => prev.elo > curr.elo ? prev : curr)
  }, [players])

  const philosopher = philosophersData.find(p => p.id === topPlayer.id)

  if (turn > maxTurns) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 py-8"
      >
        <div className="text-center mb-8">
          <Trophy className="h-16 w-16 text-accent mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Your Champion Philosopher
          </h2>
          <p className="text-muted-foreground">
            Based on your preferences, this philosopher resonates most with you
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="relative aspect-video mb-6 rounded-xl overflow-hidden">
            <Image
              src={topPlayer.image || "/placeholder.svg"}
              alt={topPlayer.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">
            {topPlayer.name}
          </h3>
          {philosopher && (
            <>
              <p className="text-sm text-muted-foreground mb-4">{philosopher.birth}</p>
              <blockquote className="border-l-4 border-accent pl-4 italic text-foreground mb-4">
                &ldquo;{philosopher.quote}&rdquo;
              </blockquote>
              <p className="text-sm text-muted-foreground">{philosopher["fun-desc"]}</p>
            </>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>
      </motion.div>
    )
  }

  const player1 = players[currentPair[0]]
  const player2 = players[currentPair[1]]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Round {turn} of {maxTurns}</span>
          <span>{Math.round((turn / maxTurns) * 100)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(turn / maxTurns) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-heading font-bold text-center text-foreground mb-8">
        Who would you rather learn from?
      </h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={turn}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {[player1, player2].map((player, index) => (
            <motion.button
              key={player.id}
              onClick={() => handleChoice(player.id)}
              className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card hover:border-primary transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={player.image || "/placeholder.svg"}
                  alt={player.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xl font-heading font-bold text-white">
                  {player.name}
                </p>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-sm font-medium text-foreground">
                {index === 0 ? "A" : "B"}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-muted-foreground mt-6">
        Click on the philosopher you prefer
      </p>
    </div>
  )
}
