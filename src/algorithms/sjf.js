export default function simulateSJF(processes) {
  const procs = JSON.parse(JSON.stringify(processes))

  procs.forEach(p => {
    p.remaining = p.burst
    p.response = -1
    p.start = null      // <-- ADD THIS
  })

  const gantt = []
  let currentTime = 0
  let completed = 0

  while (completed < procs.length) {
    const ready = procs.filter(p => p.arrival <= currentTime && p.remaining > 0)

    if (ready.length === 0) {
      const nextArrival = Math.min(...procs.filter(p => p.remaining > 0).map(p => p.arrival))

      if (nextArrival > currentTime)
        gantt.push({ pid: "Idle", start: currentTime, end: nextArrival })

      currentTime = nextArrival
      continue
    }

    ready.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival)
    const p = ready[0]

    if (p.response === -1) p.response = currentTime - p.arrival

    const start = currentTime
    p.start = start              // <------ THIS IS THE FIX
    currentTime += p.remaining
    const end = currentTime

    p.remaining = 0
    p.finish = end
    p.turnaround = p.finish - p.arrival
    p.waiting = p.turnaround - p.burst
    completed++

    gantt.push({ pid: p.id, start, end })
  }

  return { gantt, processes: procs }
}