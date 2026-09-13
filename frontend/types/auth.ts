export type LoginInput = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type AuthUser = {
  username: string;
  role: "ADMIN" | "USER";
};

export type AppUser = {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
};

export type AppUserInput = {
  username: string;
  password: string;
  role: "ADMIN" | "USER";
};
