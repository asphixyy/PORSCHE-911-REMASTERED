import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

// Initial Data
const initialModels = [
  {
    id: "carrera",
    name: "911 Carrera",
    year: "1963",
    acceleration: "3.9s",
    power: "290kW/394PS",
    topSpeed: "294km/h",
    description: "Crucial to the unique 911 driving experience: the optimal set-up. This includes new engine mountings and a completely revised chassis and even wider wheels to transform the increased power output into breathtaking dynamics."
  },
  {
    id: "cabriolet",
    name: "911 Carrera Cabriolet",
    year: "1982",
    acceleration: "4.1s",
    power: "290kW/394PS",
    topSpeed: "291km/h",
    description: "Anyone who dreams of a Porsche usually has an image in their mind: the 911 has been the epitome of an exciting, powerful sports car with day-to-day usability for 60 years."
  },
  {
    id: "targa",
    name: "911 Targa 4s",
    year: "1965",
    acceleration: "3.5s",
    power: "353kW/480PS",
    topSpeed: "300km/h",
    description: "The heart of the 911 Targa 4S still beats at the rear and sets the pulse of Porsche enthusiasts racing even faster than it did 60 years ago."
  },
  {
    id: "gt3rs",
    name: "911 GT3 RS",
    year: "1999",
    acceleration: "3.2s",
    power: "386kW/525PS",
    topSpeed: "296km/h",
    description: "The 911 GT3 RS only accepts minimalism to further reduce weight. Available as an option for the first time, the Weissach package once again saves valuable weight."
  }
];

// Load or Initialize Data
function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialModels, null, 2));
    return initialModels;
  }
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/models', (req, res) => {
  try {
    const models = loadData();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/models/:id', (req, res) => {
  try {
    const models = loadData();
    const model = models.find(m => m.id === req.params.id);
    if (!model) return res.status(404).json({ error: 'Model not found' });
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/models', (req, res) => {
  try {
    const models = loadData();
    const newModel = req.body;
    
    // Basic validation
    if (!newModel.id || !newModel.name) {
      return res.status(400).json({ error: 'ID and Name are required' });
    }

    // Check if duplicate
    if (models.some(m => m.id === newModel.id)) {
      return res.status(400).json({ error: 'Model already exists' });
    }

    const updatedModels = [...models, newModel];
    saveData(updatedModels);
    res.status(201).json(newModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Porsche API server running at http://localhost:${port}`);
});
