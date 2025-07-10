import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID ;
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY ;

export async function fetchNutrition(query: string) {
  const res = await axios.post(
    "https://trackapi.nutritionix.com/v2/natural/nutrients",
    { query },
    {
      headers: {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_APP_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}
