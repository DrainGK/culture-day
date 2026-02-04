"use client"

import { useEffect, useRef } from "react"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js"
import { Radar } from "react-chartjs-2"

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface RadarChartProps {
  scores: { A: number; B: number; C: number; D: number; E: number }
  labels?: { A: string; B: string; C: string; D: string; E: string }
}

export function RadarChart({ scores, labels }: RadarChartProps) {
  const chartRef = useRef<ChartJS<"radar">>(null)

  const defaultLabels = {
    A: "Nature & Intuition",
    B: "Radical Freedom",
    C: "Absurd Resistance",
    D: "Power Critique",
    E: "Social Ethics",
  }

  const displayLabels = labels || defaultLabels

  const data = {
    labels: [
      displayLabels.A,
      displayLabels.B,
      displayLabels.C,
      displayLabels.D,
      displayLabels.E,
    ],
    datasets: [
      {
        label: "Your Profile",
        data: [scores.A, scores.B, scores.C, scores.D, scores.E],
        backgroundColor: "rgba(135, 133, 162, 0.3)",
        borderColor: "#8785A2",
        borderWidth: 2,
        pointBackgroundColor: "#FFC7C7",
        pointBorderColor: "#8785A2",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(45, 42, 62, 0.9)",
        titleColor: "#F6F6F6",
        bodyColor: "#F6F6F6",
        borderColor: "#8785A2",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        min: 0,
        ticks: {
          stepSize: 2,
          display: false,
        },
        grid: {
          color: "rgba(135, 133, 162, 0.2)",
          circular: true,
        },
        angleLines: {
          color: "rgba(135, 133, 162, 0.2)",
        },
        pointLabels: {
          color: "#6B6880",
          font: {
            size: 12,
            family: "'Source Sans 3', sans-serif",
            weight: 500,
          },
          padding: 16,
        },
      },
    },
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Radar ref={chartRef} data={data} options={options} />
    </div>
  )
}
