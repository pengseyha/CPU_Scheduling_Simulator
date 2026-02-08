export default function simulateSRT(processes) {
  const procs = JSON.parse(JSON.stringify(processes))

  procs.forEach(p => {
    p.remaining = p.burst
    p.response = -1
    p.start = null          // <-- ADD THIS
  })

  let currentTime = 0
  const gantt = []
  let currentPid = null
  let startTime = -1

  while (true) {
    const ready = procs.filter(p => p.arrival <= currentTime && p.remaining > 0)

    if (ready.length === 0) {
      if (procs.every(p => p.remaining === 0)) break

      const nextArrival = Math.min(
        ...procs.filter(p => p.remaining > 0).map(p => p.arrival)
      )

      if (currentPid && startTime >= 0)
        gantt.push({ pid: currentPid, start: startTime, end: currentTime })

      if (nextArrival > currentTime)
        gantt.push({ pid: "Idle", start: currentTime, end: nextArrival })

      currentTime = nextArrival
      currentPid = null
      startTime = -1
      continue
    }

    // pick shortest remaining time
    ready.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival)
    const nextP = ready[0]

    if (currentPid !== nextP.id) {
      // Close previous block
      if (currentPid && startTime >= 0)
        gantt.push({ pid: currentPid, start: startTime, end: currentTime })

      // NEW PROCESS SELECTED
      startTime = currentTime
      currentPid = nextP.id

      // ⭐ FIRST TIME THE PROCESS STARTS
      if (nextP.start === null) nextP.start = currentTime   // <-- FIX HERE

      if (nextP.response === -1)
        nextP.response = currentTime - nextP.arrival
    }

    // Run for 1 time unit
    nextP.remaining--
    currentTime++

    if (nextP.remaining === 0) {
      nextP.finish = currentTime
      nextP.turnaround = nextP.finish - nextP.arrival
      nextP.waiting = nextP.turnaround - nextP.burst
    }
  }

  if (currentPid && startTime >= 0)
    gantt.push({ pid: currentPid, start: startTime, end: currentTime })

  return { gantt, processes: procs }
}