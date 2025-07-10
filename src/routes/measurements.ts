import { Router } from "express";
import { addMeasurements,getMeasurements } from "../controllers/measurementsController";


const router = Router();

router.post("/addMeasurements", addMeasurements);
router.get("/getMeasurements", getMeasurements);

export default router;