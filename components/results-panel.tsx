"use client"
import type { PredictionResult } from "@/app/page"

interface ResultsPanelProps {
  result: PredictionResult | null
  isProcessing: boolean
}

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <circle cx="12" cy="12" r="6" strokeWidth={2} />
    <circle cx="12" cy="12" r="2" strokeWidth={2} />
  </svg>
)

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

export default function ResultsPanel({ result, isProcessing }: ResultsPanelProps) {
  if (isProcessing) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="mx-auto h-6 w-6 animate-spin" />
          <p className="mt-2 text-xs">Processing...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <TargetIcon className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-xs">No Data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-3xl font-bold">{result.age}</div>
        <div className="text-xs">YEARS</div>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Confidence:</span>
          <span>{Math.round(result.confidence * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>ID:</span>
          <span>#{result.id.slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{result.timestamp.toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span>{result.confidence > 0.8 ? "AUTHENTICATED" : "REVIEW"}</span>
        </div>
      </div>
    </div>
  )
}
