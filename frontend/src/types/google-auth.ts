
type GoogleUser = {
  id: string;
  email: string;
  name: string;
  pict: string;
};

export type GoogleAuthResponse = {
  success: boolean;
  token?: string;
  user?: GoogleUser;
  err?: string;
};
