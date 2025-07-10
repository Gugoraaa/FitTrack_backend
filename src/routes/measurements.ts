import { Router } from "express";
import { addMeasurements,getMeasurements,getLatestMeasurements } from "../controllers/measurementsController";


const router = Router();

router.post("/addMeasurements", addMeasurements);
router.get("/getMeasurements", getMeasurements);
router.get("/getLatestMeasurements", getLatestMeasurements);

export default router;