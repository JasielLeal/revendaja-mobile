import { ImageBackground, ScrollView, StatusBar, SafeAreaView } from "react-native";
import bg from '../../../assets/bg.png';

export function Login() {
    return (
        <>
            <ImageBackground
                source={bg}
                className="flex-1"
                resizeMode="cover"
            >
                <SafeAreaView className="flex-1 pt-6">
                    <ScrollView>
                        
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
}
