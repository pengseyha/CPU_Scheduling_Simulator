// src/components/ProcessForm.jsx
import { useState } from 'react'
import { sampleProcesses } from '../data/sampleProcesses.js'

export default function ProcessForm({ processes, setProcesses }) {
  const [arrival, setArrival] = useState('')
  const [burst, setBurst] = useState('')

  const handleAdd = () => {
    const arr = Number(arrival)
    const bur = Number(burst)
    if (isNaN(arr) || isNaN(bur) || arr < 0 || bur <= 0) return

    const newId = `P${processes.length + 1}`
    setProcesses([...processes, { id: newId, arrival: arr, burst: bur }])
    setArrival('')
    setBurst('')
  }

  const handleLoadSample = () => {
    setProcesses(JSON.parse(JSON.stringify(sampleProcesses)))
  }

  const handleClear = () => {
    setProcesses([])
  }

  return (
    <div>
      <h2>Add Processes</h2>
      <div>
        <input
          type="number"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          placeholder="Arrival Time"
        />
        <input
          type="number"
          value={burst}
          onChange={(e) => setBurst(e.target.value)}
          placeholder="Burst Time"
        />
        <button onClick={handleAdd}>Add Process</button>
      </div>

      <button onClick={handleLoadSample}>Load Sample Data</button>
      <button onClick={handleClear}>Clear Processes</button>

      <h3>Current Processes ({processes.length})</h3>
      {processes.length === 0 ? (
        <p>No processes added yet.</p>
      ) : (
        <ul>
          {processes.map((p) => (
            <li key={p.id}>
              {p.id}: Arrival = {p.arrival}, Burst = {p.burst}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}