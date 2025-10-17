import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import type { LogFormData, LogFormProps } from "./log-form.props";
import { login } from "../../api/userApi";
import { Context } from "../../main";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

export const LogForm = observer(({ moveToReg }: LogFormProps) => {
    const { user } = useContext(Context)
    const [successMessage, setSuccessMessage] = useState('')
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        trigger,
        formState: { errors, isValid },
    } = useForm({ mode: 'onChange', criteriaMode: 'all', defaultValues: { email: '', password: '' } });

    const submitForm = async (data: LogFormData) => {
        const { email, password } = data
        try {
            const response = await login(email, password)
            user.setUser(response)
            user.setIsAuth(true)
            setSuccessMessage('Успех !')

            setTimeout(() => {
                navigate('/Spendings')
            }, 1000)
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.message) {
                    setError('root', { message: error.response.data.message })
                }
                if (error.code === "ERR_NETWORK") {
                    setError('root', { message: 'Ошибка подключения к серверу' })
                }
            } else {
                setError('root', { message: 'Непредвиденная ошибка' })
            }

        } finally {
            setTimeout(() => {
                reset()
                setSuccessMessage('')
            }, 4000)
        }
    }

    const password = watch('password')
    const email = watch('email')


    useEffect(() => {
        trigger()
    }, [password, email])

    return (
        <form onSubmit={handleSubmit(submitForm)} className="form" autoComplete="off">
            <span className="error__container header" style={{ fontSize: '10px', color: "red" }}><>{errors.root && errors.root.message}</></span>
            <span className="error__container header"><>{successMessage}</></span>
            <fieldset className="fieldset">
                <label htmlFor="user-email" className="label">Почта</label>
                <input type="email" className="input" id="user-email" autoComplete="off" autoFocus
                    {...register('email', {
                        required: true,
                        pattern: {
                            message: 'Некорректный email',
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        }
                    })} />
                <span className="error__container"><>{errors.email && errors.email.message}</></span>
            </fieldset>

            <fieldset className="fieldset">
                <label htmlFor="user-pass" className="label">Пароль</label>
                <input type="password" className="input" id="user-pass" autoComplete="off"
                    {...register('password', {
                        required: true,
                        pattern: {
                            message: 'Буквы, цифры, длина: 6-20, без пробелов',
                            value: /^\S{6,20}$/
                        }
                    })} />
                <span className="error__container"><>{errors.password && errors.password.message}</></span>
            </fieldset>

            <button type="submit" className="button" disabled={!isValid}>Submit form</button>
            <span className="hasAccount" onClick={() => moveToReg()}>Нет аккаунта?</span>
        </form>
    )
})