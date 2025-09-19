import { UserApi } from "@/auth/interfaces";

export interface Category{
  id: string,
  name: string,
  user: UserApi
}


export interface CreateCategory{
  name: string,
  userId: string
  image?: File
}
