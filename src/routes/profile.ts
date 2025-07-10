import { Router } from "express";
import { updateUsername,updateCalorieGoal } from "../controllers/profileController";  

const router = Router();


router.put("/updateUsername",updateUsername )
router.put("/updateCalorieGoal",updateCalorieGoal )
export default router;