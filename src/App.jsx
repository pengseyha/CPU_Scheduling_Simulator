// src/App.jsx
import { useState } from 'react'
import ProcessForm from './components/ProcessForm.jsx'
import GanttChart from './components/GanttChart.jsx'
import ProcessTable from './components/ProcessTable.jsx'
import Metrics from './components/MetricsTable.jsx'

import simulateFCFS from './algorithms/fcfs.js'
import simulateSJF  from './algorithms/sjf.js'
import simulateSRT  from './algorithms/srt.js'
import simulateRR   from './algorithms/rr.js'
import simulateMLFQ from './algorithms/mlfq.js'

function App() {
  const [processes, setProcesses] = useState([])
  const [algorithm, setAlgorithm] = useState('fcfs')
  const [quantum, setQuantum] = useState(2)
  const [result, setResult] = useState(null)

  const handleSimulate = () => {
    if (processes.length === 0) {
      alert('Please add at least one process before simulating.')
      return
    }

    const copied = JSON.parse(JSON.stringify(processes))

    let simResult
    switch (algorithm) {
      case 'fcfs':
        simResult = simulateFCFS(copied)
        break
      case 'sjf':
        simResult = simulateSJF(copied)
        break
      case 'srt':
        simResult = simulateSRT(copied)
        break
      case 'rr':
        simResult = simulateRR(copied, quantum)
        break
      case 'mlfq':
        simResult = simulateMLFQ(copied)
        break
      default:
        return
    }

    const { gantt, processes: updatedProcesses } = simResult

    const n = updatedProcesses.length
    const avgWaiting = updatedProcesses.reduce((sum, p) => sum + p.waiting, 0) / n
    const avgTurnaround = updatedProcesses.reduce((sum, p) => sum + p.turnaround, 0) / n
    const avgResponse = updatedProcesses.reduce((sum, p) => sum + (p.response === -1 ? 0 : p.response), 0) / n

    setResult({
      gantt,
      processes: updatedProcesses.sort((a, b) => a.id.localeCompare(b.id)),
      averages: {
        avgWaiting: avgWaiting.toFixed(2),
        avgTurnaround: avgTurnaround.toFixed(2),
        avgResponse: avgResponse.toFixed(2),
      },
    })
  }

  return (
    <>
      <h1>CPU Scheduling Algorithm Simulator</h1>

      <ProcessForm processes={processes} setProcesses={setProcesses} />

      <div className="card">
        <h2>Algorithm Selection</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <select 
            value={algorithm} 
            onChange={(e) => {
              setAlgorithm(e.target.value)
              setResult(null)
            }}
            style={{ flex: 1, minWidth: '250px', maxWidth: '400px' }}
          >
            <option value="fcfs">First Come First Serve (FCFS)</option>
            <option value="sjf">Shortest Job First (SJF)</option>
            <option value="srt">Shortest Remaining Time (SRT)</option>
            <option value="rr">Round Robin (RR)</option>
            <option value="mlfq">Multilevel Feedback Queue (MLFQ)</option>
          </select>

          {algorithm === 'rr' && (
            <>
              <label style={{ margin: 0 }}>Quantum:</label>
              <input
                type="number"
                min="1"
                value={quantum}
                onChange={(e) => setQuantum(Number(e.target.value))}
                style={{ width: '80px' }}
              />
            </>
          )}

          <button onClick={handleSimulate}>
            Simulate
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="card">
            <h2>Gantt Chart</h2>
            <GanttChart gantt={result.gantt} />
          </div>
          <ProcessTable processes={result.processes} />
          <Metrics averages={result.averages} />
        </>
      )}
    </>
  )
}

export default App