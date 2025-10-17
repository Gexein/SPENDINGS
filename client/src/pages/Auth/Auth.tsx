import { useState } from "react"
import './Auth.scss';
import { LogForm, RegForm } from "../../features";

export function AuthPage() {
    const [hasAccount, setHasAccount] = useState(false)
    const moveToLogIn = () => {
        setHasAccount(true)
    }
    const moveToReg = () => {
        setHasAccount(false)
    }
    return (
        <div className="auth__container container">
            {hasAccount
                ? <>
                    <h1 className="form__title">Авторизация</h1>
                    <LogForm moveToReg={moveToReg} />
                </>
                : <>
                    <h1 className="form__title">Регистрация</h1>
                    <RegForm moveToLogIn={moveToLogIn} />
                </>
            }
        </div>
    )
}