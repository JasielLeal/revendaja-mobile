import { CreateUser } from "@/pages/authPages/createUser/CreateUser";
import { EmailConfirmation } from "@/pages/authPages/emailConfirmation/EmailConfirmation";
import { Forget } from "@/pages/authPages/forget/forget";
import { Login } from "@/pages/authPages/login/login";
import { UpdatePassword } from "@/pages/authPages/updatePassword/UpdatePassword";
import { VerifyCode } from "@/pages/authPages/verifyCode/verifyCode";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

export function AuthRoutes() {

    const AuthStack = createStackNavigator();

    return (

        <>
            <AuthStack.Navigator>
                <AuthStack.Screen name='login' component={Login} options={{ headerShown: false }} />
                <AuthStack.Screen name="forgetpassword" component={Forget} options={{ headerShown: false }} />
                <AuthStack.Screen name="VerifyCode" component={VerifyCode} options={{ headerShown: false }} />
                <AuthStack.Screen name="emailConfirmation" component={EmailConfirmation} options={{ headerShown: false }} />
                <AuthStack.Screen name="createUser" component={CreateUser} options={{ headerShown: false }} />
                <AuthStack.Screen name="UpdatePassword" component={UpdatePassword} options={{ headerShown: false }} />
            </AuthStack.Navigator>
        </>
    )
}