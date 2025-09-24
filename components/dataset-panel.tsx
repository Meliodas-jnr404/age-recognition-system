"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { PredictionResult } from "@/app/page"
import { motion, AnimatePresence } from "framer-motion"

interface DatasetPanelProps {
  predictions: PredictionResult[]
}

const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth={2} />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" strokeWidth={2} />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" strokeWidth={2} />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
  </svg>
)

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <circle cx="12" cy="12" r="6" strokeWidth={2} />
    <circle cx="12" cy="12" r="2" strokeWidth={2} />
  </svg>
)

export default function DatasetPanel({ predictions }: DatasetPanelProps) {
  if (predictions.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-48 items-center justify-center">
        <div className="text-center">
          <DatabaseIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No predictions yet</p>
          <p className="text-xs text-muted-foreground">Recent captures will appear here</p>
        </div>
      </motion.div>
    )
  }

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 0.8) return "default"
    if (confidence >= 0.6) return "secondary"
    return "destructive"
  }

  return (
    <ScrollArea className="h-48">
      <div className="space-y-4">
        <AnimatePresence>
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <img
                    src={prediction.imageUrl || "/placeholder.svg"}
                    alt={`Prediction ${prediction.id}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="absolute bottom-1 left-1 text-xs font-bold text-white"
                  >
                    #{index + 1}
                  </motion.div>
                </motion.div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{prediction.age}</span>
                      <span className="text-sm text-muted-foreground">years</span>
                    </div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + index * 0.1 }}>
                      <Badge variant={getConfidenceBadgeVariant(prediction.confidence)}>
                        {Math.round(prediction.confidence * 100)}%
                      </Badge>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 text-xs text-muted-foreground"
                  >
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {prediction.timestamp.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <TargetIcon className="h-3 w-3" />
                      ID: {prediction.id.slice(-4)}
                    </div>
                  </motion.div>
                </div>
              </div>

              {index < predictions.length - 1 && <Separator />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  )
}
