// src/algorithms/rr.js
export default function simulateRR(processes, quantum) {
  const procs = JSON.parse(JSON.stringify(processes))
  const queue = []
  let idx = 0

  procs.forEach((p) => {
    p.remaining = p.burst
    p.response = -1
    p.finish = 0
    p.waiting = 0
    p.turnaround = 0
  })

  let currentTime = 0
  const gantt = []
  let current = null
  let timeInQuantum = 0
  let currentPid = null
  let startTime = -1

  while (true) {
    while (idx < procs.length && procs[idx].arrival <= currentTime) {
      queue.push(procs[idx++])
    }

    if (current && current.remaining === 0) {
      current = null
      timeInQuantum = 0
    }

    if ((current === null || timeInQuantum >= quantum) && queue.length > 0) {
      if (current && current.remaining > 0) {
        queue.push(current)
      }
      current = queue.shift()
      timeInQuantum = 0
      if (current.response === -1) current.response = currentTime - current.arrival
    }

    if (current === null && queue.length === 0) {
      if (idx >= procs.length && procs.every((p) => p.remaining === 0)) break
      const nextArrival = idx < procs.length ? procs[idx].arrival : Infinity
      if (currentPid) {
        gantt.push({ pid: currentPid, start: startTime, end: currentTime })
      }
      gantt.push({ pid: 'Idle', start: currentTime, end: nextArrival })
      currentTime = nextArrival
      continue
    }

    if (currentPid !== current?.id) {
      if (currentPid) {
        gantt.push({ pid: currentPid, start: startTime, end: currentTime })
      }
      startTime = currentTime
      currentPid = current?.id || null
    }

    if (current) {
      current.remaining--
      timeInQuantum++
      currentTime++

      if (current.remaining === 0) {
        current.finish = currentTime
        current.turnaround = current.finish - current.arrival
        current.waiting = current.turnaround - current.burst
      }
    }
  }

  if (currentPid) {
    gantt.push({ pid: currentPid, start: startTime, end: currentTime })
  }

  return { gantt, processes: procs }
}