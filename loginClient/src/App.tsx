import { useEffect } from "react"
import { BrowserRouter, useNavigate } from "react-router-dom"
import WebRoutes from "./routes/web"
import { ApiStructProvider } from "./context/ApiStructContext"
import { setNavigator } from "./utils/navigation"

const NavigationBridge = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setNavigator(navigate)
  }, [navigate])

  return null
}

const App = () => {
  return (
    <ApiStructProvider>
      <BrowserRouter>
        <NavigationBridge />
        <WebRoutes />
      </BrowserRouter >
    </ApiStructProvider>
  )
}

export default App