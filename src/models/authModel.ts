import pool from "../config/database";

// Check if a user with this email already exists
export const findUserByusername = async (username: string) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0];
};

// Insert a new user into the database
export const createUser = async (
  username: string,
  hashedPassword: string
) => {
  const result = await pool.query(
    "INSERT INTO users (username, password,daily_calorie_goal) VALUES ($1, $2, 0) RETURNING id, username, created_at",
    [username, hashedPassword]
  );
  return result.rows[0];
};
