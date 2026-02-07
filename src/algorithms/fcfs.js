// src/algorithms/fcfs.js
export default function simulateFCFS(processes) {
  const procs = JSON.parse(JSON.stringify(processes)).sort((a, b) => a.arrival - b.arrival)

  procs.forEach((p) => {
    p.remaining = p.burst
    p.response = -1
    p.finish = 0
    p.waiting = 0
    p.turnaround = 0
  })

  let currentTime = 0
  const gantt = []

  for (const p of procs) {
    if (currentTime < p.arrival) {
      gantt.push({ pid: 'Idle', start: currentTime, end: p.arrival })
      currentTime = p.arrival
    }
    if (p.response === -1) p.response = currentTime - p.arrival
    const start = currentTime
    currentTime += p.burst
    gantt.push({ pid: p.id, start, end: currentTime })
    p.finish = currentTime
    p.turnaround = p.finish - p.arrival
    p.waiting = p.turnaround - p.burst
  }

  return { gantt, processes: procs }
}