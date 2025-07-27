export type UserWithPassword  = {
  id: number;
  username: string;
  password:string;
  created_at: string;
  daily_calorie_goal: string;

};

export type PublicUser = Omit<UserWithPassword, 'password'>;
