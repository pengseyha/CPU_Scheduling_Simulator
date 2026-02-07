// src/components/MetricsTable.jsx
export default function Metrics({ averages }) {
  return (
    <div className="card">
      <h2>Average Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Waiting Time</h3>
          <p className="value">{averages.avgWaiting}</p>
        </div>
        <div className="metric-card">
          <h3>Turnaround Time</h3>
          <p className="value">{averages.avgTurnaround}</p>
        </div>
        <div className="metric-card">
          <h3>Response Time</h3>
          <p className="value">{averages.avgResponse}</p>
                                                                                                                                                                                                                                                                                                                          </div>
      </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    </div>
  )
}                                                                                         