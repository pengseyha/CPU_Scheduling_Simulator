// src/components/ProcessTable.jsx
export default function ProcessTable({ processes }) {
  return (
    <div className="card">
      <h2>Process Details</h2>
      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Waiting Time</th>
            <th>Turnaround Time</th>
            <th>Response Time</th>
            <th>Finish Time</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p) => (
            <tr key={p.id}>
              <td><strong>{p.id}</strong></td>
              <td>{p.arrival}</td>
              <td>{p.burst}</td>
              <td>{p.waiting}</td>
              <td>{p.turnaround}</td>
              <td>{p.response === -1 ? 'N/A' : p.response}</td>
              <td>{p.finish}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}