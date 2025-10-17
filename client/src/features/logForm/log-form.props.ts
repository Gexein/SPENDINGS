import type { User } from "../../shared/types/user";

export interface LogFormProps {
    moveToReg: () => void
}


export interface LogFormData {
    email: User['email'];
    password: User['password'];
}