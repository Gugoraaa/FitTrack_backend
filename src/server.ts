import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import AuthRoutes from "./routes/auth";
import GoalRoutes from "./routes/goals";
import WorkoutRoutes from "./routes/workout";
import NutritionRoutes from "./routes/nutrition";
import MeasurementRoutes from "./routes/measurements";  
import ProfileRoutes from "./routes/profile"; 

dotenv.config();

const app = express();
const PORT = 3000;

const allowedOrigin = process.env.ALLOWED_ORIGIN ;

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());

// API routes
app.use(apiKeyAuth); // Apply API key authentication middleware
app.use("/auth", AuthRoutes);
app.use("/goals", GoalRoutes);
app.use("/workouts", WorkoutRoutes);
app.use("/nutrition", NutritionRoutes);
app.use("/measurements", MeasurementRoutes);  
app.use("/profile", ProfileRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
