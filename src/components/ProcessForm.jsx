// src/components/ProcessForm.jsx
import { useState } from 'react'

export default function ProcessForm({
  processes,
  setProcesses,
  mlfqSettings,
  setMlfqSettings,
  selectedAlgorithm
}) {
  const [arrival, setArrival] = useState('')
  const [burst, setBurst] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editArrival, setEditArrival] = useState('')
  const [editBurst, setEditBurst] = useState('')
  const [error, setError] = useState('')

  // ---------------- PROCESS ADD ----------------
  const handleAdd = () => {
    const arr = Number(arrival)
    const bur = Number(burst)

    if (arrival === '' || burst === '') {
      setError('Please enter both arrival and burst time')
      return
    }
    if (isNaN(arr) || isNaN(bur) || arr < 0 || bur <= 0) {
      setError('Arrival must be ≥ 0 and Burst must be > 0')
      return
    }

    setError('')
    const newId = `P${processes.length + 1}`
    setProcesses([...processes, { id: newId, arrival: arr, burst: bur }])
    setArrival('')
    setBurst('')
  }

  // ---------------- PROCESS EDIT ----------------
  const handleEdit = (process) => {
    setEditingId(process.id)
    setEditArrival(process.arrival.toString())
    setEditBurst(process.burst.toString())
    setError('')
  }

  const handleSaveEdit = () => {
    const arr = Number(editArrival)
    const bur = Number(editBurst)

    if (isNaN(arr) || isNaN(bur) || arr < 0 || bur <= 0) {
      setError('Invalid values')
      return
    }

    setProcesses(
      processes.map((p) =>
        p.id === editingId ? { ...p, arrival: arr, burst: bur } : p
      )
    )

    setEditingId(null)
    setEditArrival('')
    setEditBurst('')
  }

  const handleDelete = (id) => {
    setProcesses(processes.filter((p) => p.id !== id))
  }

  return (
    <div className="card">
      <h2>Processes</h2>

      {/* Add Process */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          type="number"
          value={arrival}
          onChange={(e) => { setArrival(e.target.value); setError('') }}
          placeholder="Arrival"
          min="0"
          style={{ width: '100px' }}
        />
        <input
          type="number"
          value={burst}
          onChange={(e) => { setBurst(e.target.value); setError('') }}
          placeholder="Burst"
          min="1"
          style={{ width: '100px' }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Process List */}
      {processes.length > 0 && (
        <ul className="process-list">
        {processes.map((p) => (
          <li
            key={p.id}
            className="process-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0"
            }}
          >
            {editingId === p.id ? (
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="number"
                  value={editArrival}
                  min="0"
                  onChange={(e) => setEditArrival(e.target.value)}
                  style={{ width: "70px" }}
                />
                <input
                  type="number"
                  value={editBurst}
                  min="1"
                  onChange={(e) => setEditBurst(e.target.value)}
                  style={{ width: "70px" }}
                />

                <button className="small" onClick={handleSaveEdit}>Save</button>
                <button className="small secondary" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <div>
                  <strong>{p.id}</strong>: Arrival={p.arrival}, Burst={p.burst}
                </div>

                {/* Buttons grouped together */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="small" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="small danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
        </ul>
      )}

      {/* ⭐ MLFQ SETTINGS — only show when algorithm is MLFQ */}
      {selectedAlgorithm === "mlfq" && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>MLFQ Settings</h3>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            
            <label>Q0:</label>
            <input
              type="number"
              min="1"
              value={mlfqSettings.q0}
              onChange={(e) =>
                setMlfqSettings({ ...mlfqSettings, q0: Number(e.target.value) })
              }
              style={{ width: '80px' }}
            />

            <label>Q1:</label>
            <input
              type="number"
              min="1"
              value={mlfqSettings.q1}
              onChange={(e) =>
                setMlfqSettings({ ...mlfqSettings, q1: Number(e.target.value) })
              }
              style={{ width: '80px' }}
            />

            <label>Q2:</label>
            <input
              type="number"
              min="1"
              disabled={mlfqSettings.modeQ2 === "fcfs"}
              value={mlfqSettings.q2}
              onChange={(e) =>
                setMlfqSettings({ ...mlfqSettings, q2: Number(e.target.value) })
              }
              style={{ width: '80px' }}
            />

            <label>Level 2 Mode:</label>
            <select
              value={mlfqSettings.modeQ2}
              onChange={(e) =>
                setMlfqSettings({ ...mlfqSettings, modeQ2: e.target.value })
              }
              style={{ width: '120px' }}
            >
              <option value="fcfs">FCFS</option>
              <option value="rr">RR</option>
            </select>

            <label>Aging:</label>
            <input
              type="number"
              min="1"
              value={mlfqSettings.agingThreshold}
              onChange={(e) =>
                setMlfqSettings({
                  ...mlfqSettings,
                  agingThreshold: Number(e.target.value)
                })
              }
              style={{ width: '100px' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}