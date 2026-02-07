# CPU Scheduling Algorithm Simulator

A React-based web application for visualizing and comparing different CPU scheduling algorithms. This simulator helps understand how various scheduling algorithms work and their impact on process execution.

## Features

- **Multiple Scheduling Algorithms**: Supports 5 different CPU scheduling algorithms:
  - **FCFS (First Come First Serve)**: Non-preemptive scheduling based on arrival time
  - **SJF (Shortest Job First)**: Non-preemptive scheduling based on burst time
  - **SRT (Shortest Remaining Time)**: Preemptive version of SJF
  - **RR (Round Robin)**: Preemptive scheduling with time quantum
  - **MLFQ (Multilevel Feedback Queue)**: Multi-level queue with aging mechanism

- **Interactive Gantt Chart**: Visual representation of process execution timeline
- **Detailed Metrics**: Shows waiting time, turnaround time, and response time for each process
- **Average Metrics**: Calculates and displays average waiting, turnaround, and response times
- **Process Management**: Add custom processes or load sample data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cpu-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Usage

1. **Add Processes**: 
   - Enter arrival time and burst time for each process
   - Click "Add Process" to add it to the list
   - Use "Load Sample Data" to quickly test with example processes
   - Use "Clear Processes" to remove all processes

2. **Select Algorithm**:
   - Choose from the dropdown menu
   - For Round Robin, set the time quantum value

3. **Run Simulation**:
   - Click "Simulate" to run the selected algorithm
   - View the Gantt chart showing the execution timeline
   - Check the process table for detailed metrics
   - Review average metrics at the bottom

## Project Structure

```
cpu-scheduler/
├── src/
│   ├── algorithms/          # Scheduling algorithm implementations
│   │   ├── fcfs.js          # First Come First Serve
│   │   ├── sjf.js           # Shortest Job First
│   │   ├── srt.js           # Shortest Remaining Time
│   │   ├── rr.js            # Round Robin
│   │   └── mlfq.js          # Multilevel Feedback Queue
│   ├── components/          # React components
│   │   ├── ProcessForm.jsx  # Process input form
│   │   ├── GanttChart.jsx   # Gantt chart visualization
│   │   ├── ProcessTable.jsx # Process metrics table
│   │   └── MetricsTable.jsx # Average metrics display
│   ├── data/
│   │   └── sampleProcesses.js  # Sample process data
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── index.html
├── package.json
└── README.md
```

## Algorithm Details

### FCFS (First Come First Serve)
- Non-preemptive
- Processes are executed in order of arrival
- Simple but can lead to convoy effect

### SJF (Shortest Job First)
- Non-preemptive
- Process with shortest burst time runs first
- Optimal for minimizing average waiting time (non-preemptive)

### SRT (Shortest Remaining Time)
- Preemptive version of SJF
- Process with shortest remaining time gets CPU
- Optimal for minimizing average waiting time (preemptive)

### RR (Round Robin)
- Preemptive
- Each process gets a fixed time quantum
- Fair scheduling, prevents starvation

### MLFQ (Multilevel Feedback Queue)
- Uses multiple priority queues
- Processes start at highest priority (queue 0)
- Demoted to lower queues if they exceed quantum
- Aging mechanism promotes long-waiting processes
- Quantum: 2 (queue 0), 4 (queue 1), FCFS (queue 2)

## Technologies Used

- **React**: UI framework
- **Vite**: Build tool and dev server
- **JavaScript (ES6+)**: Programming language

## License

This project is created for educational purposes.
