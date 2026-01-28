import * as Notifications from "expo-notifications";
import { io, Socket } from "socket.io-client";
import { formatCurrency } from "../formatters";

let socket: Socket | null = null;

export function connectToStore(userId: string, queryClient?: any) {
  if (!userId) return null;

  // Avoid reconnecting if already connected
  if (socket && socket.connected) {
    // ensure joined room
    socket.emit("join-store", userId);
    return socket;
  }

  socket = io("http://192.168.100.153:3333", {
    transports: ["websocket", "polling"],
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("Socket conectado, entrando na sala da loja:", userId);
    socket?.emit("join-store", userId);
  });

  socket.on("online-order:created", async (orderData: any) => {
    console.log("🛍️ Evento online-order:created recebido", orderData);
    try {
      if (queryClient) {
        // Invalidate relevant queries so UI refreshes
        queryClient.invalidateQueries({ queryKey: ["recent-sales"] });
        queryClient.invalidateQueries({ queryKey: ["sales-pagination"] });
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        queryClient.invalidateQueries({ queryKey: ["recent-sales"] });
      }

      // Verificar permissão antes de enviar notificação
      const { status } = await Notifications.getPermissionsAsync();
      console.log("Status de permissão de notificações:", status);

      if (status === "granted") {
        console.log("Enviando notificação local...");
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Pedido online",
            body: `Um pedido no valor de ${formatCurrency(orderData.total)} acabou de ser feito. Veja os detalhes.`,
            sound: true,
            data: {
              orderId: orderData.id,
              orderNumber: orderData.orderNumber,
              total: orderData.total,
            },
          },
          trigger: null, // dispara IMEDIATO
        });
        console.log("✅ Notificação enviada com sucesso");
      } else {
        console.log("⚠️ Permissão de notificação não concedida");
      }
    } catch (err) {
      console.error("❌ Erro ao processar online-order:", err);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket desconectado:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect_error:", err);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
