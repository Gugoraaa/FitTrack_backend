import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import {authMiddleware} from "./middleware/sessionAuth"
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


//Middleware
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(apiKeyAuth); 
app.use(cookieParser())
app.use(authMiddleware)

// API routes
app.use("/auth", AuthRoutes);
app.use("/goals", GoalRoutes);
app.use("/workouts", WorkoutRoutes);
app.use("/nutrition", NutritionRoutes);
app.use("/measurements", MeasurementRoutes);  
app.use("/profile", ProfileRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
