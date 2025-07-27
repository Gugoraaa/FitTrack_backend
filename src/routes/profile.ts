import { Router } from "express";
import { updateUsername,updateCalorieGoal,getUserData } from "../controllers/profileController";  

const router = Router();


router.put("/updateUsername",updateUsername )
router.put("/updateCalorieGoal",updateCalorieGoal )
router.post("/getUserData",getUserData )
export default router;