
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { Login } from "./src/pages/authPages/login/login";

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="#fff" />
      <Login />

    </>
  );
}


