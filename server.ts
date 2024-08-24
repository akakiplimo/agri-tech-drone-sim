import express from "express"
import Simulation from "./simulation";

const app = express();
const port = 3000;

const simulation = new Simulation(20, 100);

setInterval(() => {
    simulation.updateSimulation();
}, 5000);

app.get('/api/simulation-data', (req, res) => {
    res.json(simulation.getSimulationData());
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});