import { Request, Response } from "express";
import { 
  addMeasurementsByUserDb, 
  hasNotSubmittedMeasurementsToday,
  getMeasurementsByUserDb
} from "../models/measurementsModel";


export const addMeasurements = async (req: Request, res: Response): Promise<void> => {
  const { userId, weight, waist, chest, hips, height } = req.body;

  if (!userId || !weight || !waist || !chest || !hips || !height) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  try {
    const canSubmit = await hasNotSubmittedMeasurementsToday(userId);
    if (!canSubmit) {
      res.status(400).json({ message: "You have already submitted measurements today." });
      return;
    }

    await addMeasurementsByUserDb(userId, weight, waist, chest, hips, height);
    res.status(201).json({ message: "Measurements added successfully." });
  } catch (error) {
    console.error("Error adding measurements:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getMeasurements = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;
  const parsedUserId = parseInt(userId as string); ;

  if (!userId) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const measurements = await getMeasurementsByUserDb(parsedUserId);
    res.status(200).json(measurements);
  } catch (error) {
    console.error("Error fetching measurements:", error);
    res.status(500).json({ message: "Server error." });
  }
};