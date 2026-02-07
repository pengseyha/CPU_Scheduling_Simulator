// src/algorithms/srt.js
export default function simulateSRT(processes) {
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
  let currentPid = null
  let startTime = -1

  while (true) {
    const ready = procs.filter((p) => p.arrival <= currentTime && p.remaining > 0)

    if (ready.length === 0) {
      if (procs.every((p) => p.remaining === 0)) break
      const nextArrival = Math.min(...procs.filter((p) => p.remaining > 0).map((p) => p.arrival))
      if (currentPid) {
        gantt.push({ pid: currentPid, start: startTime, end: currentTime })
      }
      gantt.push({ pid: 'Idle', start: currentTime, end: nextArrival })
      currentTime = nextArrival
      currentPid = null
      startTime = -1
      continue
    }

    ready.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival)
    const nextP = ready[0]

    if (currentPid !== nextP.id) {
      if (currentPid) {
        gantt.push({ pid: currentPid, start: startTime, end: currentTime })
      }
      startTime = currentTime
      currentPid = nextP.id
      if (nextP.response === -1) nextP.response = currentTime - nextP.arrival
    }

    nextP.remaining--
    currentTime++

    if (nextP.remaining === 0) {
      nextP.finish = currentTime
      nextP.turnaround = nextP.finish - nextP.arrival
      nextP.waiting = nextP.turnaround - nextP.burst
    }
  }

  if (currentPid) {
    gantt.push({ pid: currentPid, start: startTime, end: currentTime })
  }

  return { gantt, processes: procs }
}