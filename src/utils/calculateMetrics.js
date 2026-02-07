export default function calculateMetrics(processes, timeline) {
  const metrics = {};

  processes.forEach((p) => {
    metrics[p.pid] = {
      arrival: p.arrival,
      burst: p.burst,
      start: null,
      finish: null,
      waiting: 0,
      turnaround: 0,
      response: null,
    };
  });

  timeline.forEach((slot) => {
    const { pid, start, end } = slot;

    if (metrics[pid].start === null) {
      metrics[pid].start = start;
      metrics[pid].response = start - metrics[pid].arrival;
    }

    metrics[pid].finish = end;
  });

  Object.values(metrics).forEach((m) => {
    m.turnaround = m.finish - m.arrival;
    m.waiting = m.turnaround - m.burst;
  });

  return {
    perProcess: metrics,
    averages: {
      waiting: avg(Object.values(metrics).map((m) => m.waiting)),
      turnaround: avg(Object.values(metrics).map((m) => m.turnaround)),
      response: avg(Object.values(metrics).map((m) => m.response)),
    },
  };
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}