import pool from "../config/database";

type Exercise = {
  name: string;
  sets: number;
  maxWeight: number;
  reps: number;
};

export async function addStrengthWorkout(
  user_id: number,
  title: string,
  exercises: Exercise[]
) {
  try {
    await pool.query("BEGIN");

    const insertWorkoutQuery = `
      INSERT INTO strength_workouts (user_id, title)
      VALUES ($1, $2)
      RETURNING id
    `;
    const result = await pool.query(insertWorkoutQuery, [user_id, title]);
    const workoutId = result.rows[0].id;

    const insertExerciseQuery = `
      INSERT INTO strength_exercises (workout_id, name, sets, max_weight, reps)
      VALUES ($1, $2, $3, $4, $5)
    `;

    for (const ex of exercises) {
      await pool.query(insertExerciseQuery, [
        workoutId,
        ex.name,
        ex.sets,
        ex.maxWeight,
        ex.reps,
      ]);
    }

    await pool.query("COMMIT");
    return { id: workoutId };
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  } 
}
export const getLastStrengthSessions = async (user_id: number): Promise<any[]> => {
  const sessionResult = await pool.query(
    `
    SELECT id, user_id, title, created_at
    FROM strength_workouts
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 3
    `,
    [user_id]
  );

  const sessions = sessionResult.rows;

  const sessionsWithExercises = await Promise.all(
    sessions.map(async (session) => {
      const exercisesResult = await pool.query(
        `
        SELECT name, sets, reps, max_weight
        FROM strength_exercises
        WHERE workout_id = $1
        `,
        [session.id]
      );

      return {
        ...session,
        exercises: exercisesResult.rows,
      };
    })
  );

  return sessionsWithExercises;
};


export const getStrengthSessions = async (user_id: number): Promise<any[]> => {
  const sessionResult = await pool.query(
    `
    SELECT id, user_id, title, created_at
    FROM strength_workouts
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user_id]
  );

  const sessions = sessionResult.rows;

  const sessionsWithExercises = await Promise.all(
    sessions.map(async (session) => {
      const exercisesResult = await pool.query(
        `
        SELECT name, sets, reps, max_weight
        FROM strength_exercises
        WHERE workout_id = $1
        `,
        [session.id]
      );

      return {
        ...session,
        exercises: exercisesResult.rows,
      };
    })
  );

  return sessionsWithExercises;
};

export const deleteStrengthSession = async (id: number) => {
  try{
    const deleteExercises = await pool.query(
      `
      DELETE FROM strength_exercises
      WHERE workout_id = $1 
      RETURNING *;
      `,
      [id]
    );

    const deleteSesion = await pool.query(
      `
      DELETE FROM strength_workouts
      WHERE id = $1 
      RETURNING *;
      `,
      [id]
    );
    return true
  }catch (err) {
    return false;
  }
  
  return

}