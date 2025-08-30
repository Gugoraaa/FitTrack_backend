import { Router } from "express";
import { getLastSession,getLastGoal } from "../controllers/summaryController";

const router= Router()


router.get("/getLastSession/:id",getLastSession)
router.get("/getLastGoal/:id",getLastGoal)


export default router