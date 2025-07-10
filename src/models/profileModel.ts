import pool from "../config/database";

export async function updateUsernameDb(userId: number, newUsername: string) {
  const query = `
    UPDATE users
    SET username = $2   
    WHERE id = $1
  `;
  const result = await pool.query(query, [userId, newUsername]);
  return result.rows[0];
}

export async function updateCalorieGoalDb(userId: number, newGoal: number) {
  const query = `
    UPDATE users
    SET daily_calorie_goal = $2   
    WHERE id = $1
  `;
  const result = await pool.query(query, [userId, newGoal]);
  return result.rows[0];
}