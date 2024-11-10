import { Login } from "@/pages/authPages/login/login";
import { createStackNavigator } from "@react-navigation/stack";

export function AuthRoutes() {

    const AuthStack = createStackNavigator();

    return (

        <>
            <AuthStack.Navigator>
                <AuthStack.Screen name='login' component={Login} options={{ headerShown: false }} />
            </AuthStack.Navigator>
        </>
    )
}