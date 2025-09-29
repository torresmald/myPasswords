export interface User {
  email: string;
  password: string;
}

export interface UserRegister extends User {
  name: string;
  image: File;
  // sendWhatsapp?: boolean
}

export interface UserApi extends User {
  id: string;
  name: string;
  roles: string[];
  token: string;
  isValidUser: boolean;
  image?: File;
}

export interface UpdateUser {
  name: string;
  token: string;
  password: string;
  repeatPassword: string;
  image?: File;
}
