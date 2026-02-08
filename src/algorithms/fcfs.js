export default function simulateFCFS(processes) {
  const procs = JSON.parse(JSON.stringify(processes))
    .sort((a, b) => a.arrival - b.arrival)

  procs.forEach(p => {
    p.remaining = p.burst
    p.response = -1
    p.finish = 0
    p.waiting = 0
    p.turnaround = 0
    p.start = null             // <– ADD
  })

  let currentTime = 0
  const gantt = []

  for (const p of procs) {
    if (currentTime < p.arrival) {
      if (p.arrival > currentTime) {
        gantt.push({ pid: "Idle", start: currentTime, end: p.arrival })
      }
      currentTime = p.arrival
    }

    if (p.response === -1) {
      p.response = currentTime - p.arrival
    }

    const start = currentTime
    p.start = start            // <–––––––––––––––––––– ADD THIS LINE
    currentTime += p.burst
    const end = currentTime

    gantt.push({ pid: p.id, start, end })

    p.finish = end
    p.turnaround = p.finish - p.arrival
    p.waiting = p.turnaround - p.burst
  }

  return { gantt, processes: procs }
}