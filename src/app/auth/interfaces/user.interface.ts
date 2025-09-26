export interface UserLogin {
  email: string;
  password: string
}

export interface UserRegister {
  email: string;
  password: string
  name: string
  image: File
 // sendWhatsapp?: boolean
}


