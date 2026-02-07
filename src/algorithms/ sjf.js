// src/algorithms/sjf.js
export default function simulateSJF(processes) {
  const procs = JSON.parse(JSON.stringify(processes))

  procs.forEach((p) => {
    p.remaining = p.burst
    p.response = -1
    p.finish = 0
    p.waiting = 0
    p.turnaround = 0
  })

  let currentTime = 0
  const gantt = []
  let completed = 0

  while (completed < procs.length) {
    const ready = procs.filter((p) => p.arrival <= currentTime && p.remaining > 0)
    if (ready.length === 0) {
      const nextArrival = Math.min(...procs.filter((p) => p.remaining > 0).map((p) => p.arrival))
      gantt.push({ pid: 'Idle', start: currentTime, end: nextArrival })
      currentTime = nextArrival
      continue
    }

    ready.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival)
    const p = ready[0]

    if (p.response === -1) p.response = currentTime - p.arrival
    const start = currentTime
    currentTime += p.remaining
    gantt.push({ pid: p.id, start, end: currentTime })
    p.finish = currentTime
    p.turnaround = p.finish - p.arrival
    p.waiting = p.turnaround - p.burst
    p.remaining = 0
    completed++
  }

  return { gantt, processes: procs }
}