import { Home } from "@/pages/appPages/home/home";
import { RootStackParamList } from "@/types/navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { Extract } from "@/pages/appPages/financial/extract";
import { SaleInitiator } from "@/pages/appPages/saleInitiator/saleInitiator";
import { Overview } from "@/pages/appPages/store/components/overview/overview";
import { Stock } from "@/pages/appPages/store/components/stock/stock";
import { Report } from "@/pages/appPages/store/components/report/report";
import { Promotions } from "@/pages/appPages/store/components/promotions/promotions";
import { SaleDetails } from "@/pages/appPages/saleDetails/saleDetails";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();
const StorePages = createStackNavigator()

function SubAppRoutes() {

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({

                tabBarLabelStyle: {
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
                                name={focused ? "home" : "home-outline"}
                                size={size}
                                color={focused ? '#fff' : color}
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Extract"
                component={Extract}
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
                                name={focused ? "stats-chart" : "stats-chart-outline"}
                                size={size}
                                color={focused ? '#fff' : color}
                            />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="saleInitiator"
                component={SaleInitiator}
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
                                name={focused ? "add" : "add-outline"}
                                size={size}
                                color={focused ? '#fff' : color}
                            />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Store"
                component={StoreRoutes}
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
                                name={focused ? "bag-check" : "bag-check-outline"}
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

function StoreRoutes() {
    return (
        <StorePages.Navigator>
            <StorePages.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
            <StorePages.Screen name="Stock" component={Stock} options={{ headerShown: false }} />
            <StorePages.Screen name="Report" component={Report} options={{ headerShown: false }} />
            <StorePages.Screen name="Promotions" component={Promotions} options={{ headerShown: false }} />
        </StorePages.Navigator>
    )
}


export default function AppRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="appRoutes" component={SubAppRoutes} options={{ headerShown: false }} />
            <Stack.Screen name="SaleDetails" component={SaleDetails} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}