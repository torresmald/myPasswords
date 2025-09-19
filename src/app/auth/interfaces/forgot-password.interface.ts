export interface ForgotPasswordReset {
  token: string;
  password: string;
  repeatPassword: string;
}

export interface ForgotPassword{
  message: string
}
