import type { User } from "../../shared/types/user";

export interface RegFormProps {
    moveToLogIn: () => void
}

export interface RegFormData {
    name: User['name'];
    email: User['email'];
    password: User['password'];
    confirm: User['password']
}