// src/algorithms/mlfq.js
export default function simulateMLFQ(processes) {
  const procs = JSON.parse(JSON.stringify(processes))
  const queues = [[], [], []] // Level 0: highest priority
  const quanta = [2, 4, 999999] // Last queue effectively FCFS
  const agingThreshold = 10

  procs.forEach((p) => {
    p.level = 0
    p.lastRunTime = -1
    p.remaining = p.burst
    p.response = -1
    p.finish = 0
    p.waiting = 0
    p.turnaround = 0
  })

  let currentTime = 0
  const gantt = []
  let arrIdx = 0
  let current = null
  let timeInQuantum = 0
  let currentPid = null
  let startTime = -1

  while (true) {
    // Add newly arrived processes to queue 0
    while (arrIdx < procs.length && procs[arrIdx].arrival <= currentTime) {
      queues[0].push(procs[arrIdx++])
    }

    // Aging: promote processes that have waited too long
    const promoted = []
    for (let level = 1; level < 3; level++) {
      for (let i = 0; i < queues[level].length; i++) {
        const p = queues[level][i]
        if (p.lastRunTime !== -1 && currentTime - p.lastRunTime > agingThreshold && p.remaining > 0) {
          promoted.push({ p, level, index: i })
        }
      }
    }
    promoted.forEach(({ p, level, index }) => {
      queues[level].splice(index, 1)
      p.level = Math.max(0, p.level - 1)
      queues[p.level].push(p)
    })

    // Find highest non-empty queue
    let level = 0
    while (level < 3 && queues[level].length === 0) level++

    if (level === 3) {
      // No processes ready
      const nextArrival = arrIdx < procs.length ? procs[arrIdx].arrival : Infinity
      if (nextArrival === Infinity && queues.flat().every((p) => p.remaining === 0)) break

      if (currentPid) {
        gantt.push({ pid: currentPid, start: startTime, end: currentTime })
      }
      gantt.push({ pid: 'Idle', start: currentTime, end: nextArrival })
      currentTime = nextArrival
      current = null
      timeInQuantum = 0
      continue
    }

    // Check if we need to switch
    const needSwitch =
      current === null ||
      current.remaining === 0 ||
      timeInQuantum >= quanta[current.level] ||
      level < current.level

    if (needSwitch) {
      if (current && current.remaining > 0) {
        if (timeInQuantum >= quanta[current.level]) {
          // Demote
          current.level = Math.min(2, current.level + 1)
          queues[current.level].push(current)
        } else {
          // Preempted by higher priority - put back at front
          queues[current.level].unshift(current)
        }
      }
      current = queues[level].shift()
      timeInQuantum = 0
      current.lastRunTime = currentTime
      if (current.response === -1) current.response = currentTime - current.arrival
    }

    // Execute one unit
    if (currentPid !== current.id) {
      if (currentPid) {
        gantt.push({ pid: currentPid, start: startTime, end: currentTime })
      }
      startTime = currentTime
      currentPid = current.id
    }

    current.remaining--
    timeInQuantum++
    currentTime++

    if (current.remaining === 0) {
      current.finish = currentTime
      current.turnaround = current.finish - current.arrival
      current.waiting = current.turnaround - current.burst
      current = null
      timeInQuantum = 0
    }
  }

  if (currentPid) {
    gantt.push({ pid: currentPid, start: startTime, end: currentTime })
  }

  return { gantt, processes: procs }
}