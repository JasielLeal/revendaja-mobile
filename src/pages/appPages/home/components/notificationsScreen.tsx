import { useNotification } from '@/context/NotificationContext'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export function NotificationsScreen() {
    const { unreadCount } = useNotification(); // Usando o contexto para obter a contagem de notificações

    return (
        <View className='relative'>
            <View className='bg-secondarySecondary p-2 rounded-full'>
                <Icon name='notifications-outline' size={25} color={'#fff'} />
            </View>
            {unreadCount > 0 && (
                <View
                    className='absolute -right-4 -top-1 bg-[#da6404] flex items-center justify-center'
                    style={{
                        width: unreadCount > 9 ? 24 : 20, // Largura ajustável dependendo da contagem
                        height: 20, // Altura fixa para manter a forma circular
                        borderRadius: 10, // Torna o elemento redondo
                    }}
                >
                    <Text className='text-white font-medium text-xs'>
                        {unreadCount > 9 ? '+9' : unreadCount}
                    </Text>
                </View>
            )}
        </View>
    );
}