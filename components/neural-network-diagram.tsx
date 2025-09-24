"use client"

export default function NeuralNetworkDiagram() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-card">
      <svg width="100%" height="100%" viewBox="0 0 200 120" className="max-w-full max-h-full">
        {/* Input Layer */}
        <g>
          <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="80" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="5" y="105" fontSize="8" fill="currentColor">
            Input
          </text>
        </g>

        {/* Hidden Layer 1 */}
        <g>
          <circle cx="70" cy="15" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="70" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="70" cy="45" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="70" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="70" cy="75" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="70" cy="90" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="55" y="105" fontSize="8" fill="currentColor">
            Hidden
          </text>
        </g>

        {/* Hidden Layer 2 */}
        <g>
          <circle cx="120" cy="25" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="120" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="120" cy="55" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="120" cy="70" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="105" y="105" fontSize="8" fill="currentColor">
            Hidden
          </text>
        </g>

        {/* Output Layer */}
        <g>
          <circle cx="170" cy="35" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="170" cy="55" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="155" y="105" fontSize="8" fill="currentColor">
            Output
          </text>
        </g>

        {/* Connections - Input to Hidden 1 */}
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.6">
          {[20, 40, 60, 80].map((y1) =>
            [15, 30, 45, 60, 75, 90].map((y2) => <line key={`${y1}-${y2}`} x1="26" y1={y1} x2="64" y2={y2} />),
          )}
        </g>

        {/* Connections - Hidden 1 to Hidden 2 */}
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.6">
          {[15, 30, 45, 60, 75, 90].map((y1) =>
            [25, 40, 55, 70].map((y2) => <line key={`h1-${y1}-${y2}`} x1="76" y1={y1} x2="114" y2={y2} />),
          )}
        </g>

        {/* Connections - Hidden 2 to Output */}
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.6">
          {[25, 40, 55, 70].map((y1) =>
            [35, 55].map((y2) => <line key={`h2-${y1}-${y2}`} x1="126" y1={y1} x2="164" y2={y2} />),
          )}
        </g>
      </svg>
    </div>
  )
}
