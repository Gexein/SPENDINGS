import { jwtDecode } from "jwt-decode"
import type { User } from "../shared/types/user"
import { $host, $authHost } from "./api"


export const registration = async (email: User['email'], password: User['password'], name: User['name']): Promise<User> => {
    const { data } = await $host.post('api/user/registration', { email, password, name })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email: User['email'], password: User['password']): Promise<User> => {
    const { data } = await $host.post('api/user/login', { email, password })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async (): Promise<User> => {
    const { data } = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}