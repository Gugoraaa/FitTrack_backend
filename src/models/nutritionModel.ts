// src/models/dailyCalorieModel.ts
import pool from "../config/database";

export async function getDailyCaloriesDb(userId: number, date: string) {
  const query = `
    SELECT * FROM daily_calorie_logs
    WHERE user_id = $1 AND date = $2
    LIMIT 1
  `;
  const result = await pool.query(query, [userId, date]);
  return result.rows[0];
}

export async function addOrUpdateCaloriesDb(
  userId: number,
  date: string,
  calories: number
) {
  const query = `
    INSERT INTO daily_calorie_logs (user_id, date, total_calories)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, date)
    DO UPDATE SET total_calories = daily_calorie_logs.total_calories + $3
    RETURNING *
  `;
  const result = await pool.query(query, [userId, date, calories]);
  return result.rows[0];
}

export async function resetCaloriesDb(userId: number, date: string) {
  const query = `
    UPDATE daily_calorie_logs
    SET calories = 0
    WHERE user_id = $1 AND log_date = $2
  `;
  await pool.query(query, [userId, date]);
}

export async function getCaloriesGoalDb(userId: number) {
  const query = `
    SELECT daily_calorie_goal FROM users
    WHERE id = $1`;
    const result = await pool.query(query, [userId])
    return result.rows[0]; 
}

export async function getFoodEntriesTodayDb(userId: number) {
  const query = `
    SELECT id, description, calories, created_at
       FROM food_entries
       WHERE user_id = $1 AND date = CURRENT_DATE
       ORDER BY created_at ASC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export const addFoodEntry = async (
  user_id: number,
  description: string,
  calories: number
): Promise<void> => {
  const query = `
    INSERT INTO food_entries (user_id, description, calories)
    VALUES ($1, $2, $3)
  `;

  await pool.query(query, [user_id, description, calories]);
};