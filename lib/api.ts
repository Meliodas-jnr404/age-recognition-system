export interface RostoApiResponse {
  age: number
  confidence: number
}

export const mockPredictAge = async (imageFile: File): Promise<RostoApiResponse> => {
  // Mock implementation for development/demo purposes
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

  return {
    age: Math.floor(Math.random() * 60) + 18, // Random age between 18-78
    confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7-1.0
  }
}
