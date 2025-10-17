import { useContext, useEffect } from "react"
import { Context } from "../../main"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"

export const SpendingsPage = observer(() => {
    const { user } = useContext(Context)
    const navigate = useNavigate()
    useEffect(() => {
        if (!user.isAuth) {
            navigate('/Unathorized')
        }
    })
    return (
        <>
            <h1>SPENDINGS PAGE</h1>
        </>
    )
})
