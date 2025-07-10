import { Router } from "express";
import { addGoal,getUserGoals,editGoal,deleteGoal  } from "../controllers/goalController";

const router = Router();

router.post("/add", addGoal);
router.post("/getUserGoals", getUserGoals);
router.post("/update", editGoal);
router.delete("/delete", deleteGoal);

export default router;
