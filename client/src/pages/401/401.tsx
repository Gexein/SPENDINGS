import { Link } from "react-router-dom"

export function UnathorizedPage() {
    return (
        <>
            <h1>Для доступа к этой странице нужны авторизоваться | 401</h1>
            <Link to='/Auth'><button>Авторизация</button></Link>
            <Link to='/'><button>На главную</button></Link>
        </>
    )
}