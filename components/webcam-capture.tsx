"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockPredictAge } from "@/lib/api"
import type { PredictionResult } from "@/app/page"

interface WebcamCaptureProps {
  onPrediction: (result: PredictionResult) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const SquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
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

const AlertIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <line x1="12" y1="8" x2="12" y2="12" strokeWidth={2} />
    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={2} />
  </svg>
)

export default function WebcamCapture({ onPrediction, isProcessing, setIsProcessing }: WebcamCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      console.log("[v0] Starting camera access...")

      const mediaStream = await Promise.race([
        navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
            frameRate: { ideal: 30 },
          },
          audio: false,
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Camera access timeout")), 10000)),
      ])

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          console.log("[v0] Video metadata loaded")
          videoRef.current?.play()
        }
        videoRef.current.oncanplay = () => {
          console.log("[v0] Video can play")
          setIsStreaming(true)
        }
      }

      setStream(mediaStream)
    } catch (err) {
      console.error("[v0] Camera access error:", err)
      setError("Failed to access camera. Please check permissions and try again.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsStreaming(false)
    }
  }, [stream])

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    console.log("[v0] Capturing photo...")

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) return

        try {
          setIsProcessing(true)
          setError(null)
          console.log("[v0] Processing image...")

          // Convert blob to File
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" })

          // Call age prediction API
          const result = await mockPredictAge(file)
          console.log("[v0] Age prediction result:", result)

          // Create image URL for display
          const imageUrl = URL.createObjectURL(blob)

          // Create prediction result
          const prediction: PredictionResult = {
            id: Date.now().toString(),
            age: result.age,
            confidence: result.confidence,
            timestamp: new Date(),
            imageUrl,
          }

          onPrediction(prediction)
        } catch (err) {
          console.error("[v0] Processing error:", err)
          setError(err instanceof Error ? err.message : "Failed to process image")
        } finally {
          setIsProcessing(false)
        }
      },
      "image/jpeg",
      0.8,
    )
  }, [isProcessing, onPrediction, setIsProcessing])

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
        {isStreaming ? (
          <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <CameraIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Camera not active</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for capturing frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="flex gap-2">
        {!isStreaming ? (
          <Button onClick={startCamera} className="flex-1 text-xs">
            <CameraIcon className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={capturePhoto} disabled={isProcessing} className="flex-1 text-xs">
              {isProcessing ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Capture & Analyze
                </>
              )}
            </Button>
            <Button onClick={stopCamera} variant="outline" disabled={isProcessing} className="text-xs bg-transparent">
              <SquareIcon className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertIcon className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <Alert>
          <LoaderIcon className="h-4 w-4 animate-spin" />
          <AlertDescription className="text-xs">Analyzing image for age prediction...</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
