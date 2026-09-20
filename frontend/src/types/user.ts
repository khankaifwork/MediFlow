export type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: "admin" | "pharmacist" | string;
  is_active: boolean;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};
