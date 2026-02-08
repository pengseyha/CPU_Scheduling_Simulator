export default function simulateMLFQ(processes, settings) {
  const { q0, q1, q2, useFCFS, agingThreshold } = settings;

  const procs = JSON.parse(JSON.stringify(processes));
  procs.sort((a, b) => a.arrival - b.arrival);

  const queues = [[], [], []];
  const quanta = [q0, q1, useFCFS ? Infinity : q2];

  procs.forEach(p => {
    p.level = 0;
    p.remaining = p.burst;
    p.lastEnqueue = p.arrival;
    p.response = -1;
    p.finish = 0;
  });

  let currentTime = 0;
  let current = null;
  let timeUsed = 0;
  let runningLevel = 0;

  let arrIdx = 0;
  const gantt = [];
  let currentPid = null;
  let startTime = 0;

  while (true) {
    while (arrIdx < procs.length && procs[arrIdx].arrival <= currentTime) {
      const p = procs[arrIdx++];
      p.level = 0;
      p.lastEnqueue = currentTime;
      queues[0].push(p);
    }

    // Aging Q2→Q1→Q0
    for (let lvl of [2, 1]) {
      const stay = [];
      for (const p of queues[lvl]) {
        if (currentTime - p.lastEnqueue >= agingThreshold) {
          p.level = lvl - 1;
          p.lastEnqueue = currentTime;
          queues[lvl - 1].push(p);
        } else stay.push(p);
      }
      queues[lvl] = stay;
    }

    // find next queue
    let lvl = 0;
    while (lvl < 3 && queues[lvl].length === 0) lvl++;

    if (lvl === 3 && current === null) {
      const nextArrival = arrIdx < procs.length ? procs[arrIdx].arrival : Infinity;
      if (nextArrival === Infinity) break;
      if (currentPid) gantt.push({ pid: currentPid, start: startTime, end: currentTime });
      gantt.push({ pid: "Idle", start: currentTime, end: nextArrival });
      currentTime = nextArrival;
      continue;
    }

    let needSwitch = false;
    if (!current) needSwitch = true;
    else if (current.remaining === 0) needSwitch = true;
    else if (timeUsed === quanta[runningLevel]) needSwitch = true;
    else if (lvl < runningLevel) needSwitch = true;

    if (needSwitch) {
      if (current && current.remaining > 0) {
        if (timeUsed === quanta[runningLevel]) {
          current.level = Math.min(2, current.level + 1);
        }
        current.lastEnqueue = currentTime;
        queues[current.level].push(current);
      }

      if (lvl < 3) {
        current = queues[lvl].shift();
        runningLevel = current.level;
        current.lastEnqueue = currentTime;
      } else current = null;

      timeUsed = 0;

      if (currentPid !== (current?.id ?? null)) {
        if (currentPid) gantt.push({ pid: currentPid, start: startTime, end: currentTime });
        currentPid = current?.id ?? null;
        startTime = currentTime;
      }

      if (current && current.response === -1) {
        current.response = currentTime - current.arrival;
      }
    }

    if (current) {
      current.remaining--;
      timeUsed++;
    }

    currentTime++;

    // ✔ FIXED: removed “currentPid = null”
    if (current && current.remaining === 0) {
      current.finish = currentTime;
      current.turnaround = current.finish - current.arrival;
      current.waiting = current.turnaround - current.burst;

      current = null;
      timeUsed = 0;
    }
  }

  if (currentPid) {
    gantt.push({ pid: currentPid, start: startTime, end: currentTime });
  }

  return { gantt, processes: procs };
}