import pool from "../config/database";

export const createGoal = async (
  user_id: number,
  name: string,
  end_date: string
) => {
  const query = `
    INSERT INTO goals (user_id, name, end_date, status)
    VALUES ($1, $2, $3, 'active');
  `;
  const values = [user_id, name, end_date];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export async function getGoalsByUser(user_id: number) {
  const result = await pool.query(
    `SELECT * FROM goals WHERE user_id = $1 ORDER BY end_date ASC`,
    [user_id]
  );
  return result.rows;
}

export const updateGoal = async (
  id: number,
  name: string,
  end_date: string,
  status: string
): Promise<void> => {
  await pool.query(
    "UPDATE goals SET name = $1, end_date = $2, status = $3 WHERE id = $4",
    [name, end_date, status, id]
  );
};

export const deleteGoalById = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM goals WHERE id = $1", [id]);
}