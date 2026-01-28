import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { api } from '@/app/backend/api';

export async function registerPushToken(storeId: string) {
  try {
    // Verificar se é um dispositivo real
    if (!Device.isDevice) {
      console.log('⚠️ Push tokens funcionam apenas em dispositivos reais');
      return null;
    }

    // Solicitar permissão
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('⚠️ Permissão de notificação negada');
      return null;
    }

    console.log('Gerando token de push...');

    // Obter token de push
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: '0dddc372-db6b-41dd-8b10-ecfaac5cc4e3',
      })
    ).data;

    console.log('🎫 Token de push obtido:', token);

    // Obter informações do dispositivo
    const deviceId = Device.osInternalBuildId || Device.deviceName || 'unknown';
    const deviceName = Device.deviceName || 'Mobile Device';

    console.log({
        token,
        storeId,
        deviceId,
        deviceName,
    });

    // Registrar token no backend
    await api.post('/push-tokens/register', {
      token,
      provider: 'expo',
      storeId,
      deviceId,
      deviceName,
    });

    console.log('✅ Token de push registrado com sucesso');
    return token;
  } catch (error) {
    console.error('❌ Erro ao registrar token de push:', error);
    return null;
  }
}
