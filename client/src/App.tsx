import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import { AccountPage, AdminPage, AuthPage, HomePage, NotFoundPage, SpendingsPage, UnathorizedPage } from "./pages"
import { RootLayout } from "./layouts"
import { useContext, useEffect, useState } from "react"
import { Context } from "./main"
import { observer } from "mobx-react-lite"
import { check } from "./api/userApi"
import { Spinner } from "./features"

const App = observer(() => {
  const { user } = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check()
      .then((result) => {
        user.setUser(result)
        user.setIsAuth(true)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
  }, [])

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<RootLayout />} >
      <Route index element={<HomePage />} />
      <Route path="Auth" element={<AuthPage />} />
      <Route path="Spendings" element={<SpendingsPage />} />
      <Route path="Account" element={<AccountPage />} />
      <Route path="Admin" element={<AdminPage />} />
      <Route path="Unathorized" element={<UnathorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  ))

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  )

})



export default App
