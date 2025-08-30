import { promises } from "dns";
import pool from "../config/database"


export const getLastCardioSessionsByUserID = async (user_id: number) => {
  const result = await pool.query(
    `
    SELECT * FROM cardio_sessions
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
    `,
    [user_id]
  );

  return result.rows;
};

export const getLastStrengthSessionByUserID = async (user_id: number): Promise<any> => {
  const sessionResult = await pool.query(
    `
    SELECT id, user_id, title, created_at
    FROM strength_workouts
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [user_id]
  );

  return sessionResult.rows[0];
  
};

export const getStrengthSessionsByID= async (session_id: number): Promise<any> => {
  const exercisesResult = await pool.query(
        `
        SELECT name, sets, reps, max_weight
        FROM strength_exercises
        WHERE workout_id = $1
        `,
        [session_id]
    );
    
  return exercisesResult.rows
  

}
export async function getLastGoalByID(user_id: number) {
  const result = await pool.query(
    `SELECT * FROM goals
     WHERE user_id = $1
     ORDER BY end_date ASC
     LIMIT 1 `,

    [user_id]
  );
  return result.rows;
}