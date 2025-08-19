import { Router } from "express";
import { getLastSession } from "../controllers/summaryController";

const router= Router()


router.get("/getLastSession/:id",getLastSession)


export default router