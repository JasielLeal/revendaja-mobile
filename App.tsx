
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { Login } from "./src/pages/authPages/login/login";
import { GluestackUIProvider } from "@/components/gluestack-ui-provider";
import { VerifyCode } from "@/pages/authPages/verifyCode/verifyCode";
import { Forget } from "@/pages/authPages/forget/forget";

export default function App() {
  return (
    <>
      <GluestackUIProvider>
        <StatusBar backgroundColor="#000" style="light"/>
        <Forget/>
      </GluestackUIProvider>
    </>
  );
}


