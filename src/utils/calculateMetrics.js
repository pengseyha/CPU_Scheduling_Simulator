export default function calculateMetrics(processes) {
  const metrics = {};

  processes.forEach((p) => {
    metrics[p.id] = {
      arrival: p.arrival,
      burst: p.burst,
      start: p.start,        // <-- USE ONLY REAL START TIME
      finish: p.finish,
      waiting: p.waiting,
      turnaround: p.turnaround,
      response: p.response
    };
  });

  const arr = Object.values(metrics);

  return {
    perProcess: metrics,
    averages: {
      waiting: avg(arr.map((m) => m.waiting)),
      turnaround: avg(arr.map((m) => m.turnaround)),
      response: avg(arr.map((m) => m.response)),
    },
  };
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}