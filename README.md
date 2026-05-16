# WanderAI - Intelligent Travel Planner

WanderAI (formerly CAA-TIOS-ND) is a production-grade, full-stack travel itinerary optimization application. It leverages a custom Meta-Heuristic Machine Learning model (Random Forest Regressor) to intelligently generate, rank, and route multi-day travel itineraries anywhere in the world.

## Key Features

- **Dynamic Global Discovery**: Powered by the Google Places API, users can search for any city globally. WanderAI automatically discovers the top tourist attractions, ratings, and operating hours.
- **Auto-Plan Magic Wand**: Instantly generates a perfectly balanced multi-day itinerary. Simply select a city and the number of days, and the AI handles the rest.
- **Geographic Nearest-Neighbor Routing**: The backend engine utilizes a deterministic Haversine distance TSP solver to mathematically route your trip, ensuring no backtracking or criss-crossing lines.
- **Post-Processing Time Simulator**: Simulates a live digital clock for your trip. It calculates geographic travel times between locations, enforces operating hours, and strictly skips locations that would push your day past 8:00 PM.
- **Interactive Map Preview**: A stunning, live-updating Google Map directly on the Trip Planner screen provides instant visual feedback as you build your trip.

## Architecture

The project is structured into three clean directories:

1. **/frontend**: A beautiful, modern React application powered by Vite and styled with Tailwind CSS v4. Features Lucide React icons and the `@react-google-maps/api` for rendering complex `DirectionsRenderer` paths.
2. **/backend**: A blazing fast Python API built with FastAPI. It handles data ingestion, model inference, route calculation, and time simulation.
3. **/model**: The core machine learning engine. Contains the original `caa_tios_nd_model.joblib` Random Forest models, the training script `train_caa_tios_nd.py`, the Jupyter training notebook, and the training datasets.

## Getting Started

### 1. Configure Environment Variables
You will need a Google Maps API Key with the "Places API" and "Directions API" enabled.
Create a `.env` file inside the `/frontend` directory:
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 2. Start the Backend (FastAPI)
Open a terminal and navigate to the backend directory:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The backend will run on `http://127.0.0.1:8000`.

### 3. Start the Frontend (React + Vite)
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`. Open this in your browser to start planning!

## Machine Learning Pipeline Note
The core AI uses a `RandomForestRegressor` trained on a dataset of optimized travel parameters to rank locations based on user preferences. Because static regressors struggle with temporal accumulation, the backend FastAPI layer augments the AI's output with a deterministic "Time Simulation Loop" to ensure mathematically perfect, realistic scheduling.
