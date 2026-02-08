// src/components/ProcessForm.jsx
import { useState } from 'react'
import { sampleProcesses, sampleProcesses2, sampleProcesses3 } from '../data/sampleProcesses.js'

export default function ProcessForm({ processes, setProcesses }) {
  const [arrival, setArrival] = useState('')
  const [burst, setBurst] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editArrival, setEditArrival] = useState('')
  const [editBurst, setEditBurst] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    const arr = Number(arrival)
    const bur = Number(burst)
    
    if (arrival === '' || burst === '') {
      setError('Please enter both arrival and burst time')
      return
    }
    
    if (isNaN(arr) || isNaN(bur)) {
      setError('Please enter valid numbers')
      return
    }
    
    if (arr < 0 || bur <= 0) {
      setError('Arrival time must be ≥ 0 and burst time must be > 0')
      return
    }

    setError('')
    const newId = `P${processes.length + 1}`
    setProcesses([...processes, { id: newId, arrival: arr, burst: bur }])
    setArrival('')
    setBurst('')
  }

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

    setError('')
    setProcesses(processes.map(p => 
      p.id === editingId 
        ? { ...p, arrival: arr, burst: bur }
        : p
    ))
    setEditingId(null)
    setEditArrival('')
    setEditBurst('')
  }

  const handleDelete = (id) => {
    setProcesses(processes.filter(p => p.id !== id))
  }

  const handleLoadSample = (sample) => {
    setProcesses(JSON.parse(JSON.stringify(sample)))
    setError('')
  }

  const handleClear = () => {
    if (processes.length === 0) return
    if (window.confirm('Are you sure you want to clear all processes?')) {
      setProcesses([])
      setError('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="card">
      <h2>Processes</h2>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        <input
          type="number"
          value={arrival}
          onChange={(e) => { setArrival(e.target.value); setError('') }}
          onKeyPress={handleKeyPress}
          placeholder="Arrival"
          min="0"
          style={{ width: '100px' }}
        />
        <input
          type="number"
          value={burst}
          onChange={(e) => { setBurst(e.target.value); setError('') }}
          onKeyPress={handleKeyPress}
          placeholder="Burst"
          min="1"
          style={{ width: '100px' }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {error && <p className="error-message">{error}</p>}

      {processes.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Process List</h3>
          <ul className="process-list">
            {processes.map((p) => (
              <li key={p.id} className="process-item">
                {editingId === p.id ? (
                  <>
                    <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                      <input
                        type="number"
                        value={editArrival}
                        onChange={(e) => setEditArrival(e.target.value)}
                        style={{ width: '70px' }}
                        min="0"
                        placeholder="Arrival"
                      />
                      <input
                        type="number"
                        value={editBurst}
                        onChange={(e) => setEditBurst(e.target.value)}
                        style={{ width: '70px' }}
                        min="1"
                        placeholder="Burst"
                      />
                    </div>
                    <div className="process-item-actions">
                      <button onClick={handleSaveEdit} className="small">Save</button>
                      <button onClick={() => setEditingId(null)} className="small secondary">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="process-item-info">
                      <strong>{p.id}</strong>: Arrival={p.arrival}, Burst={p.burst}
                    </div>
                    <div className="process-item-actions">
                      <button onClick={() => handleEdit(p)} className="small">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="small danger">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}