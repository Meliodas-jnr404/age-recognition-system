"use client"

import { useState } from "react"
import WebcamCapture from "@/components/webcam-capture"
import ResultsPanel from "@/components/results-panel"
import NeuralNetworkDiagram from "@/components/neural-network-diagram"

export interface PredictionResult {
  id: string
  age: number
  confidence: number
  timestamp: Date
  imageUrl: string
}

export default function AgeRecognitionSystem() {
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    totalPredictions: 0,
    avgConfidence: 0,
    avgAge: 0,
    processingTime: 0,
  })

  const handleNewPrediction = (result: PredictionResult) => {
    console.log("[v0] New prediction received:", result)
    setCurrentResult(result)
    setPredictions((prev) => {
      const newPredictions = [result, ...prev.slice(0, 9)] // Keep last 10 predictions

      // Update session stats
      const total = newPredictions.length
      const avgConf = newPredictions.reduce((sum, p) => sum + p.confidence, 0) / total
      const avgAge = newPredictions.reduce((sum, p) => sum + p.age, 0) / total

      setSessionStats({
        totalPredictions: total,
        avgConfidence: avgConf,
        avgAge: avgAge,
        processingTime: Math.random() * 2 + 1, // Mock processing time
      })

      return newPredictions
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="technical-panel mb-6">
          <h1 className="technical-header text-lg lg:text-xl">AGE RECOGNITION BIOMETRIC AUTHENTICATION SYSTEM</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column - Neural Network & Progress */}
          <div className="xl:col-span-3 space-y-4">
            <div className="technical-panel">
              <h3 className="font-bold mb-4 text-sm">Neural Network Architecture</h3>
              <div className="h-48 mb-4">
                <NeuralNetworkDiagram />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Algorithm</span>
                  <span>CNN-ResNet50</span>
                </div>
                <div className="flex justify-between">
                  <span>Training</span>
                  <span>Transfer Learning</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy</span>
                  <span>94.2%</span>
                </div>
              </div>
            </div>

            <div className="technical-panel">
              <h3 className="font-bold mb-4 text-sm">Session Progress</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Total Predictions</span>
                  <span>{sessionStats.totalPredictions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Confidence</span>
                  <span>{(sessionStats.avgConfidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Age</span>
                  <span>{sessionStats.avgAge.toFixed(1)} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time</span>
                  <span>{sessionStats.processingTime.toFixed(2)}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Validation Checks</span>
                  <span>12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Model Parameters & Techniques */}
          <div className="xl:col-span-3 space-y-4">
            <div className="technical-panel">
              <h3 className="font-bold mb-4 text-sm">Detection Technique</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="scale-75" />
                  <span>CNN</span>
                  <input type="radio" readOnly className="scale-75" />
                  <span>SVM</span>
                  <input type="radio" readOnly className="scale-75" />
                  <span>RF</span>
                </div>
              </div>
            </div>

            <div className="technical-panel">
              <h3 className="font-bold mb-4 text-sm">Model Parameters</h3>
              <div className="space-y-2 text-xs">
                <div>Loss Function: Cross-Entropy</div>
                <div className="flex justify-between">
                  <span>Input Size</span>
                  <span>224x224</span>
                </div>
                <div className="flex justify-between">
                  <span>Batch Size</span>
                  <span>32</span>
                </div>
                <div className="flex justify-between">
                  <span>Learning Rate</span>
                  <span>0.001</span>
                </div>
                <div className="flex justify-between">
                  <span>Epochs</span>
                  <span>100</span>
                </div>
                <div className="flex justify-between">
                  <span>Dropout Rate</span>
                  <span>0.5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Live Capture & Data */}
          <div className="xl:col-span-6 space-y-4">
            <div className="technical-panel">
              <h3 className="font-bold mb-4 text-sm">Age Detection Dataset</h3>
              <div className="overflow-x-auto mb-4">
                <table className="data-table min-w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Sample</th>
                      <th>Predicted Age</th>
                      <th>Confidence</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.slice(0, 6).map((pred, idx) => (
                      <tr key={pred.id}>
                        <td>A{String(idx + 1).padStart(2, "0")}</td>
                        <td>{String(idx + 1).padStart(3, "0")}</td>
                        <td>{pred.age} years</td>
                        <td>{(pred.confidence * 100).toFixed(1)}%</td>
                        <td>{pred.confidence > 0.8 ? "HIGH" : "MEDIUM"}</td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 6 - predictions.length) }).map((_, idx) => (
                      <tr key={`empty-${idx}`}>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="technical-panel">
                <h3 className="font-bold mb-4 text-sm">Live Age Detection</h3>
                <WebcamCapture
                  onPrediction={handleNewPrediction}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="technical-panel">
                <h3 className="font-bold mb-4 text-sm">Current Detection Result</h3>
                <div className="border border-foreground p-4 bg-card">
                  <ResultsPanel result={currentResult} isProcessing={isProcessing} />
                </div>
              </div>

              <div className="technical-panel">
                <h3 className="font-bold mb-4 text-sm">Confidence Analysis</h3>
                <div className="border border-foreground p-4 bg-card text-center">
                  <div className="text-3xl font-bold mb-2">
                    {currentResult ? (currentResult.confidence * 100).toFixed(1) : "0.0"}%
                  </div>
                  <div className="text-xs text-muted-foreground">Detection Confidence</div>
                </div>
              </div>
            </div>

            {/* Evaluation Metrics */}
            <div className="technical-panel">
              <h3 className="font-bold mb-4 text-sm">Model Performance Metrics</h3>
              <div className="overflow-x-auto">
                <table className="data-table min-w-full">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Precision(%)</th>
                      <th>Recall(%)</th>
                      <th>F1-Score(%)</th>
                      <th>MAE</th>
                      <th>RMSE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>CNN-ResNet50</td>
                      <td>94.23</td>
                      <td>92.15</td>
                      <td>93.18</td>
                      <td>3.2</td>
                      <td>4.8</td>
                    </tr>
                    <tr>
                      <td>VGG-16</td>
                      <td>89.67</td>
                      <td>87.45</td>
                      <td>88.54</td>
                      <td>4.1</td>
                      <td>5.9</td>
                    </tr>
                    <tr>
                      <td>MobileNet</td>
                      <td>86.34</td>
                      <td>84.12</td>
                      <td>85.21</td>
                      <td>4.8</td>
                      <td>6.3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
