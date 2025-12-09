import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerOwnerPushToken(
  storeId: string,
  jwtToken: string // Token do dono da loja
) {
  try {
    // 1. Verificar se é dispositivo físico
    if (!Device.isDevice) {
      console.warn("⚠️ Notificações push requerem dispositivo físico");
      return;
    }

    // 2. Solicitar permissão
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("❌ Permissão de notificações negada");
      return;
    }

    // 3. Obter token
    const pushToken = (await Notifications.getExpoPushTokenAsync()).data;

    // 4. Registrar no backend (COM autenticação)
    await registerTokenWithBackend(pushToken, storeId, jwtToken);

    console.log("✅ Token registrado:", pushToken);
  } catch (error) {
    console.error("❌ Erro ao registrar push token:", error);
  }
}

async function registerTokenWithBackend(
  pushToken: string,
  storeId: string,
  jwtToken: string
) {
  try {
    const response = await fetch(
      "https://seu-servidor.com/api/push-tokens/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          token: pushToken,
          provider: "expo",
          storeId,
          deviceId: Device.osInternalBuildId,
          deviceName: Device.modelName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Token registrado com sucesso:", data);
  } catch (error) {
    console.error("❌ Erro ao registrar token:", error);
  }
}
