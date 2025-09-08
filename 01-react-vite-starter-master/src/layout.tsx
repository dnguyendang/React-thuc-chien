import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"


function Layout() {

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export default Layout
