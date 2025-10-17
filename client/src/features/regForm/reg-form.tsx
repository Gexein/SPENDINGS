import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import type { RegFormData, RegFormProps } from "./reg-from.props";
import { registration } from "../../api/userApi";
import { AxiosError } from "axios";



export function RegForm({ moveToLogIn }: RegFormProps) {
    const [successMessage, setSuccessMessage] = useState('')


    const {
        register,
        handleSubmit,
        watch,
        setError,
        trigger,
        reset,
        formState: { errors, isValid },
    } = useForm({ mode: 'onChange', criteriaMode: 'all', defaultValues: { name: '', email: '', password: '', confirm: '' } });

    const submitForm = async (data: RegFormData) => {
        const { email, password, name } = data
        try {
            await registration(email, password, name)
            setSuccessMessage('Успех !')
            setTimeout(() => {
                moveToLogIn()
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
    const confirm = watch('confirm')

    useEffect(() => {
        trigger()
    }, [confirm, password])



    return (
        <form onSubmit={handleSubmit(submitForm)} className="form" autoComplete="off">
            <span className="error__container header" style={{ fontSize: '10px', color: "red" }}><>{errors.root && errors.root.message}</></span>
            <span className="error__container header"><>{successMessage}</></span>
            <fieldset className="fieldset">
                <label htmlFor="user-name" className="label">Имя</label>
                <input type="text" className="input" id="user-name" autoComplete="off" autoFocus
                    {...register('name', {
                        required: true,
                        pattern: {
                            message: 'Буквы, цифры, длина: 4-20, без пробелов',
                            value: /^[a-zA-Zа-яА-ЯёЁ0-9]{4,20}$/
                        }
                    })}
                />
                <span className="error__container"><>{errors.name && errors.name.message}</></span>
            </fieldset>

            <fieldset className="fieldset">
                <label htmlFor="user-email" className="label">Почта</label>
                <input type="email" className="input" id="user-email" autoComplete="off"
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
                        },
                        onChange: () => trigger('confirm')
                    })} />
                <span className="error__container"><>{errors.password && errors.password.message}</></span>
            </fieldset>

            <fieldset className="fieldset">
                <label htmlFor="user-confirm-pass" className="label">Повторите пароль</label>
                <input type="password" className="input" id="user-confirm-pass" autoComplete="off"
                    {...register('confirm', {
                        required: true,
                        validate: { matches: value => value === password || 'Пароли не совпадают' }
                    })} />
                <span className="error__container"><>{errors.confirm && errors.confirm.message}</></span>
            </fieldset>

            <button type="submit" className="button" disabled={!isValid}>Submit form</button>
            <span className="hasAccount" onClick={() => moveToLogIn()}>Есть аккаунт ?</span>
        </form>
    )
}