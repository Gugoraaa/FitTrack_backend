import pool from "../config/database";

export const addCardioSession = async (
  user_id: number,
  title: string,
  kilometers: number,
  minutes: number
) => {
  const result = await pool.query(
    `
    INSERT INTO cardio_sessions (user_id, title, kilometers, minutes)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [user_id, title, kilometers, minutes]
  );

  return result.rows[0];
};

export const getLastCardioSessionsByUser = async (user_id: number) => {
  const result = await pool.query(
    `
    SELECT * FROM cardio_sessions
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 3;
    `,
    [user_id]
  );

  return result.rows;
};

export const getCardioSessionsByUser = async (user_id: number) => {
  const result = await pool.query(
    `
    SELECT * FROM cardio_sessions
    WHERE user_id = $1
    ORDER BY created_at DESC;
    `,
    [user_id]
  );

  return result.rows;
};

export const deleteCardioSession = async (id: number) => {
  const result = await pool.query(
    `
    DELETE FROM cardio_sessions
    WHERE id = $1 
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];
};
