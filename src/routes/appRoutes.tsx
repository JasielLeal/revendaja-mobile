import { Home } from "@/pages/appPages/home/home";
import { RootStackParamList } from "@/types/navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';

export function AppRoutes() {

    const Tab = createBottomTabNavigator();
    const Stack = createStackNavigator<RootStackParamList>();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                
                tabBarLabelStyle:{
                    marginBottom: 10,
                    color: "#fff"
                }, 
                tabBarActiveTintColor: "#FF7100",
                tabBarStyle: {
                    backgroundColor: '#202020',
                    borderTopWidth: 1,
                    borderColor: '#171717',
                    elevation: 0,
                    paddingBottom: 50,
                    paddingTop: 10
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <View
                            className={`items-center justify-center ${focused ? 'bg-primaryPrimary rounded-full' : ''}`}
                            style={{
                                width: size + 20,
                                height: size + 20,
                                margin: focused ? -5 : 0,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Icon
                                name="home"
                                size={size}
                                color={focused ? '#fff' : color}
                            />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
