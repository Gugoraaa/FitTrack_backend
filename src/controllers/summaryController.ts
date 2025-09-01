import { Request, Response } from "express";
import {
  getLastCardioSessionsByUserID,
  getLastStrengthSessionByUserID,
  getStrengthSessionsByID,
  getLastGoalByID,
} from "../models/summaryModel";
import { cardioSchema, strengthSchema } from "../schemas/sessions.schemas";

export const getLastSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userID = Number(req.params.id);
    if (!userID) {
      res.status(400).json({ error: "No user id" });
      return;
    }

    const [rawCardio, rawStrength] = await Promise.all([
      getLastCardioSessionsByUserID(userID),
      getLastStrengthSessionByUserID(userID),
    ]);

    const cardioRow = Array.isArray(rawCardio)
      ? rawCardio[0]
      : rawCardio || null;
    const strengthRow = rawStrength ?? null;

    const cardioParsed = cardioRow
      ? cardioSchema.safeParse(cardioRow)
      : { success: false as const };
    const strengthParsed = strengthRow
      ? strengthSchema.safeParse(strengthRow)
      : { success: false as const };

    const cardio = cardioParsed.success ? cardioParsed.data : null;
    const strength = strengthParsed.success ? strengthParsed.data : null;

    if (!cardio && !strength) {
      res
        .status(200)
        .json({
          latest: null,
          cardio: null,
          strength: null,
          message: "No sessions found.",
        });
      return;
    }
    let latest: any;
    let type: "cardio" | "strength";

    if (cardio && strength) {
      if (new Date(cardio.created_at) >= new Date(strength.created_at)) {
        latest = cardio;
        type = "cardio";
      } else {
        latest = strength;
        type = "strength";
      }
    } else if (cardio) {
      latest = cardio;
      type = "cardio";
    } else {
      latest = strength!;
      type = "strength";
    }

    if (type == "strength") {
      const item = await getStrengthSessionsByID(latest.id);
      latest.exercises = item;
    }
    res.status(200).json({
      latest,
      type,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLastGoal = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userID = Number(req.params.id);
  if (!userID) {
    res.status(400).json({ error: "No user id" });
    return;
  }

  try {
    const lastGoal = await getLastGoalByID(userID);
    res.status(200).json(lastGoal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ message: "Server error" });
  }

  
};
