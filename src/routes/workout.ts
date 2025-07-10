import { Router } from "express";
import { createCardioSession,getUserCardioSessions,removeCardioSession,getUserLastCardioSessions } from "../controllers/workoutCardioController";
import { createStrengthWorkout,getStrengthWorkouts, removeStrengthSession,getUserLastStrengtSessions } from "../controllers/workoutStrengthController";


const router = Router();

router.post("/addCardioSession",createCardioSession);
router.post("/getCardioSessions",getUserCardioSessions);
router.post("/getLastCardioSessions",getUserLastCardioSessions);
router.delete("/deleteCardioSession",removeCardioSession);

router.post("/addStrengthWorkout", createStrengthWorkout);
router.post("/getStrengthWorkout", getStrengthWorkouts);
router.post("/getLastStrengtSessions",getUserLastStrengtSessions);
router.delete("/deleteStrengthWorkout",removeStrengthSession)


export default router;
