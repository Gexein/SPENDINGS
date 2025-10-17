import { Outlet } from "react-router-dom";
import { Header } from "../../features";

export function RootLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}