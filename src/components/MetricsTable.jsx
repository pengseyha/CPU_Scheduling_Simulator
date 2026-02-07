// src/components/MetricsTable.jsx
export default function Metrics({ averages }) {
  return (
    <div>
      <h2>Average Metrics</h2>
      <p><strong>Average Waiting Time:</strong> {averages.avgWaiting}</p>
      <p><strong>Average Turnaround Time:</strong> {averages.avgTurnaround}</p>
      <p><strong>Average Response Time:</strong> {averages.avgResponse}</p>
    </div>
  )
}