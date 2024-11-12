import AuthContext from "@/context/authContext"
import { useContext } from "react"
import { AuthRoutes } from "./authRoutes"
import AppRoutes from "./appRoutes"


export function Routes() {

    const { signed } = useContext(AuthContext)
    
    return signed ? <AppRoutes/> : <AuthRoutes />
}