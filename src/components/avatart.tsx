import AuthContext from "@/context/authContext";
import React, { useContext } from "react";
import { Image, Text, View } from "react-native";

export function Avatar() {

    const { user } = useContext(AuthContext);

    function GetInitial(name: string | undefined, surname: string | undefined): string {
        if (!name || !surname) {
            return ""; // Retorna uma string vazia se algum dos parâmetros estiver ausente
        }

        return name[0].toUpperCase() + surname[0].toUpperCase(); // Retorna a primeira letra de cada um em maiúsculas
    }

    // Exemplo de uso com user
    const initials = GetInitial(user?.name, user?.secondName);

    return (
        <>

            {user?.image != null ?
                <Image
                    source={{
                        uri: user?.image
                    }}
                    width={46}
                    height={46}
                    className="rounded-full"
                />
                :

                <>
                    <View className="bg-white p-4 rounded-full">
                        <Text>
                            {initials}
                        </Text>
                    </View>
                    
                </>

            }


        </>
    )
}