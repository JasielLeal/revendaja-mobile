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
import { SaleDetails } from "@/pages/appPages/saleDetails/saleDetails";
import { Tickets } from "@/pages/appPages/tickets/tickets";
import { AddBankSlip } from "@/pages/appPages/tickets/components/addBankSlip";
import { TicketsDetails } from "@/pages/appPages/tickets/components/ticketsDetails";
import { Profile } from "@/pages/appPages/profile/profile";
import { AddProductToStock } from "@/pages/appPages/store/components/stock/components/addProductToStock";
import { DetailsProductStock } from "@/pages/appPages/store/components/stock/components/detailsProductStock";
import { OurPlans } from "@/pages/appPages/profile/components/ourPlans";
import { PedingSale } from "@/pages/appPages/store/components/pendingSale/pendingSale";
import { PedingSaleDetails } from "@/pages/appPages/store/components/pendingSale/components/PendingSaleDetails";
import { AddCustomProductToStock } from "@/pages/appPages/store/components/stock/components/addCustomProductToStock";
import { NavigationContainer } from '@react-navigation/native';
import { Store } from "@/pages/appPages/store/store";
import { MyPlan } from "@/pages/appPages/profile/components/myPlan/MyPlan";
import { Notifications } from "@/pages/appPages/notifications/notifications";

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

            <Tab.Screen
                name="Profile"
                component={Profile}
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
                                name={focused ? "shield-checkmark" : "shield-checkmark-outline"}
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

export function StoreRoutes() {
    return (
        
            <Store>
                <StorePages.Navigator>
                    <StorePages.Screen name="Overview" component={Overview} options={{ headerShown: false }} />
                    <StorePages.Screen name="Stock" component={Stock} options={{ headerShown: false }} />
                    <StorePages.Screen name="Report" component={Report} options={{ headerShown: false }} />
                    <StorePages.Screen name="PedingSale" component={PedingSale} options={{ headerShown: false }} />
                </StorePages.Navigator>
            </Store>
     

    )
}


export default function AppRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="appRoutes" component={SubAppRoutes} options={{ headerShown: false }} />
            <Stack.Screen name="SaleDetails" component={SaleDetails} options={{ headerShown: false }} />
            <Stack.Screen name="PedingSaleDetails" component={PedingSaleDetails} options={{ headerShown: false }} />
            <Stack.Screen name="tickets" component={Tickets} options={{ headerShown: false }} />
            <Stack.Screen name="AddBankSlip" component={AddBankSlip} options={{ headerShown: false }} />
            <Stack.Screen name="TicketsDetails" component={TicketsDetails} options={{ headerShown: false }} />
            <Stack.Screen name="AddProductToStock" component={AddProductToStock} options={{ headerShown: false }} />
            <Stack.Screen name="DetailsProductStock" component={DetailsProductStock} options={{ headerShown: false }} />
            <Stack.Screen name="OurPlans" component={OurPlans} options={{ headerShown: false }} />
            <Stack.Screen name="AddCustomProduct" component={AddCustomProductToStock} options={{ headerShown: false }} />
            <Stack.Screen name="MyPlan" component={MyPlan} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />

        </Stack.Navigator>
    )
}