import pool from "../config/database";

export async function addMeasurementsByUserDb(userId: number, weight:number, waist:number, chest:number, hips:number, height:number) {
  const query = `
    INSERT INTO body_measurements (user_id, weight, waist, chest, hips, height) 
    VALUES ($1, $2, $3, $4, $5, $6)    
  `;
  const values = [userId, weight, waist, chest, hips, height    ];
  
  const result = await pool.query(query, values);
}


export async function hasNotSubmittedMeasurementsToday (userId: number): Promise<boolean> {
    const query = `
        SELECT COUNT(*) FROM body_measurements
        WHERE user_id = $1 AND DATE(date) = CURRENT_DATE
    `;
    const values = [userId];    
    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count) === 0;

}

export async function getMeasurementsByUserDb(userId: number) {
  const query = `
    SELECT * FROM body_measurements
    WHERE user_id = $1 
  `;
  const values = [userId];
  
  const result = await pool.query(query, values);
  return result.rows;
}