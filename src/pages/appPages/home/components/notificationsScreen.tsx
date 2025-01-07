import { View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export function NotificationsScreen() {
 
    return (
        <View className='bg-secondarySecondary p-2 rounded-full'>
           <Icon name='notifications-outline' size={25} color={'#fff'}/>
        </View>
    )
}