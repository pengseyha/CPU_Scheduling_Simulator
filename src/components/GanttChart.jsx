// src/components/GanttChart.jsx
export default function GanttChart({ gantt }) {
  if (!gantt || gantt.length === 0) return null

  const maxTime = Math.max(...gantt.map((seg) => seg.end))
  const tickStep = Math.max(1, Math.ceil(maxTime / 20))

  const ticks = []
  for (let t = 0; t <= maxTime; t += tickStep) {
    ticks.push(t)
  }
  if (ticks[ticks.length - 1] !== maxTime) ticks.push(maxTime)

  const getColor = (pid) => {
    if (pid === 'Idle') return '#e0e0e0'
    let hash = 0
    for (let i = 0; i < pid.length; i++) {
      hash = pid.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 70%, 50%)`
  }

  return (
    <div className="gantt-chart">
      <div className="timeline">
        {gantt.map((seg, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(seg.start / maxTime) * 100}%`,
              width: `${((seg.end - seg.start) / maxTime) * 100}%`,
              height: '100%',
              backgroundColor: getColor(seg.pid),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: seg.pid === 'Idle' ? '#666' : 'white',
              fontWeight: 'bold',
              fontSize: seg.end - seg.start > 3 ? '14px' : '11px',
              overflow: 'hidden',
              borderRight: '1px solid rgba(0,0,0,0.1)',
            }}
            title={`${seg.pid}: ${seg.start} - ${seg.end} (Duration: ${seg.end - seg.start})`}
          >
            {seg.pid}
            {seg.end - seg.start > 4 && ` (${seg.start}-${seg.end})`}
          </div>
        ))}
      </div>
      <div className="time-labels">
        {ticks.map((t) => (
          <span key={t} style={{ left: `${(t / maxTime) * 100}%` }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}