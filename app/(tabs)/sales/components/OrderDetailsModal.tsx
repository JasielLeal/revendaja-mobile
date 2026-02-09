import { useAuth } from "@/app/providers/AuthProvider";
import { Dialog } from "@/components/ui/Dialog";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { formatCurrency, formatDate, formatDateFull } from "@/lib/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useConfirmSale } from "../hooks/useconfirmSale";
import { useOrderDelete } from "../hooks/useOrderDelete";
import { useUpdateOrderDate } from "../hooks/useUpdateOrderDate";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  imgUrl: string;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  isDelivery: boolean;
  deliveryStreet: string;
  deliveryNumber: string;
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onRefresh: () => void;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => { bg: string; text: string };
}

export function OrderDetailsModal({
  visible,
  order,
  onClose,
  onRefresh,
  getStatusLabel,
  getStatusColor,
}: OrderDetailsModalProps) {
  const colors = useThemeColors();
  const [showDialog, setShowDialog] = React.useState(false);
  const [isEditingDate, setIsEditingDate] = React.useState(false);
  const [dateInput, setDateInput] = React.useState("");
  const [localCreatedAt, setLocalCreatedAt] = React.useState<string | null>(
    null,
  );

  const { user } = useAuth();
  console.log(user);

  const handleWhatsApp = () => {
    if (!order) return;

    const phone = order.customerPhone.replace(/\D/g, "");

    let message = `Olá *${order.customerName}*, tudo bem? 😊\n\n`;

    message += `Aqui é a *${user?.storeInformation?.name}*,\n`;
    message += `Recebemos seu pedido pelo nosso site e estou entrando em contato para dar continuidade ao atendimento.\n\n`;

    message += `━━━━━━━━━━━━━━\n`;
    message += `🛍️ *ITENS DO PEDIDO*\n`;
    message += `━━━━━━━━━━━━━━\n`;

    order.items.forEach((item) => {
      message += `• *${item.name}*\n`;
      message += `  Quantidade: *${item.quantity}x*\n`;
      message += `  Subtotal: *${formatCurrency(item.price * item.quantity)}*\n\n`;
    });

    message += `━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL:* ${formatCurrency(order.total)}\n`;
    message += `💳 *FORMA DE PAGAMENTO:* ${order.paymentMethod}\n`;
    message += `━━━━━━━━━━━━━━\n\n`;

    if (order.isDelivery) {
      message += `🚚 *ENTREGA*\n`;
      message += `${order.deliveryStreet}, ${order.deliveryNumber}\n\n`;
    } else {
      message += `🏪 *RETIRADA NA LOJA*\n\n`;
    }

    if (order.paymentMethod.toLowerCase() === "pix") {
      message += `📲 *PAGAMENTO VIA PIX*\n`;
      message += `Chave PIX: *123.456.789-00*\n\n`;
      message += `Assim que realizar o pagamento, me envie o comprovante para darmos sequência ao pedido 😉✨`;
    } else {
      message += `Já já vamos providenciar seu pedido!\n`;
      message += `Qualquer dúvida, estou à disposição 😊`;
    }

    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const mutationConfirmSale = useConfirmSale();
  const mutationUpdateOrderDate = useUpdateOrderDate();
  const queryClient = useQueryClient();

  const originalDate = localCreatedAt ? formatDateFull(localCreatedAt) : "";

  React.useEffect(() => {
    if (!order) return;

    setLocalCreatedAt(order.createdAt ?? null);
    setDateInput(order.createdAt ? formatDateFull(order.createdAt) : "");
    setIsEditingDate(false);
  }, [order, visible]);

  function formatDateInput(input: string) {
    const cleaned = input.replace(/\D/g, "");

    let day = cleaned.substring(0, 2);
    let month = cleaned.substring(2, 4);
    let year = cleaned.substring(4, 8);

    if (cleaned.length <= 2) return day;
    if (cleaned.length <= 4) return `${day}/${month}`;
    return `${day}/${month}/${year}`;
  }

  function formatIsoWithTime(dateStr: string, baseDate?: string) {
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;

    const [dayStr, monthStr, yearStr] = parts;
    if (dayStr.length !== 2 || monthStr.length !== 2 || yearStr.length !== 4)
      return null;

    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);

    if (day < 1 || day > 31) return null;
    if (month < 1 || month > 12) return null;
    if (year < 2000 || year > 2100) return null;

    const base = baseDate ? new Date(baseDate) : null;
    const hours = base ? String(base.getHours()).padStart(2, "0") : "00";
    const minutes = base ? String(base.getMinutes()).padStart(2, "0") : "00";
    const seconds = base ? String(base.getSeconds()).padStart(2, "0") : "00";
    const ms = base ? String(base.getMilliseconds()).padStart(3, "0") : "000";

    return `${yearStr}-${monthStr}-${dayStr} ${hours}:${minutes}:${seconds}.${ms}`;
  }

  const handleConfirmSale = async () => {
    if (!order) return;

    mutationConfirmSale.mutate(
      { id: order.id, status: "approved" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["recent-sales"] });
          queryClient.invalidateQueries({ queryKey: ["sales-pagination"] });
          queryClient.invalidateQueries({ queryKey: ["sales"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
          onClose();
          onRefresh();
          Alert.alert("Sucesso", "Venda confirmada!");
        },
        onError: () => {
          Alert.alert("Erro", "Erro ao confirmar venda");
        },
      },
    );
  };

  const handleSaveOrderDate = () => {
    if (!order) return;

    const isoDate = formatIsoWithTime(dateInput, localCreatedAt ?? undefined);
    if (!isoDate) {
      Alert.alert(
        "Data invalida",
        "Informe uma data valida no formato DD/MM/AAAA.",
      );
      return;
    }

    mutationUpdateOrderDate.mutate(
      { id: order.id, newDate: isoDate },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["recent-sales"] });
          queryClient.invalidateQueries({ queryKey: ["sales-pagination"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
          queryClient.invalidateQueries({ queryKey: ["sales"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
          onRefresh();
          setLocalCreatedAt(isoDate);
          setDateInput(formatDateFull(isoDate));
          setIsEditingDate(false);
        },
        onError: () => {
          Alert.alert("Erro", "Erro ao atualizar a data da venda.");
        },
      },
    );
  };

  const orderDelete = useOrderDelete();

  const handleDeleteSale = () => {
    if (!order) return;

    Alert.alert(
      "Deletar Venda",
      "Tem certeza que deseja deletar esta venda? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            await orderDelete.mutateAsync(order.id, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["recent-sales"] });
                queryClient.invalidateQueries({
                  queryKey: ["sales-pagination"],
                });
                queryClient.invalidateQueries({ queryKey: ["sales"] });
                queryClient.invalidateQueries({
                  queryKey: ["dashboard-metrics"],
                });
                onRefresh();
                onClose();
              },
              onError: () => {
                setShowDialog(true);
              },
            });
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          className="flex-1 mt-20 rounded-t-3xl"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header do Modal */}
          <View
            className="items-center pt-2 pb-6"
            style={{ backgroundColor: colors.primary }}
          >
            <View className="flex-row items-center justify-between w-full px-4 mb-2 mt-4">
              <View>
                <Text
                  className="uppercase"
                  allowFontScaling={false}
                  style={{
                    color: colors.primaryForeground + "90",
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  Informações da Venda
                </Text>
                <Text
                  className="text-xl font-black mb-1"
                  allowFontScaling={false}
                  style={{ color: colors.primaryForeground }}
                >
                  #{order?.orderNumber}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.primaryForeground}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6">
            {/* Informações do Cliente */}

            <View>
              <View className="my-6">
                <View className="flex flex-row justify-between items-center mb-4">
                  <View
                    className="rounded-full px-4 py-1.5 mt-2"
                    style={{
                      backgroundColor: getStatusColor(order?.status || "").bg,
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      allowFontScaling={false}
                      style={{
                        color: getStatusColor(order?.status || "").text,
                      }}
                    >
                      {getStatusLabel(order?.status || "")}
                    </Text>
                  </View>
                  {/* Deletar */}
                  <TouchableOpacity onPress={handleDeleteSale}>
                    <Ionicons name="trash" size={25} color="#f20c0f" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center py-2">
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={colors.mutedForeground}
                      />
                      <View className="ml-3 flex-1">
                        <Text
                          className="text-xs"
                          allowFontScaling={false}
                          style={{ color: colors.mutedForeground }}
                        >
                          Cliente
                        </Text>
                        <Text
                          className="text-base font-semibold"
                          style={{ color: colors.foreground }}
                          allowFontScaling={false}
                        >
                          {order?.customerName}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center py-2">
                      <Ionicons
                        name="call-outline"
                        size={20}
                        color={colors.mutedForeground}
                      />
                      <View className="ml-3 flex-1">
                        <Text
                          allowFontScaling={false}
                          className="text-xs"
                          style={{ color: colors.mutedForeground }}
                        >
                          Telefone
                        </Text>
                        <Text
                          allowFontScaling={false}
                          className="text-base font-semibold"
                          style={{ color: colors.foreground }}
                        >
                          {order?.customerPhone
                            ? order.customerPhone
                            : "Não informado"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center py-2">
                      <Ionicons
                        name="card-outline"
                        size={20}
                        color={colors.mutedForeground}
                      />
                      <View className="ml-3 flex-1">
                        <Text
                          allowFontScaling={false}
                          className="text-xs"
                          style={{ color: colors.mutedForeground }}
                        >
                          Método de Pagamento
                        </Text>
                        <Text
                          allowFontScaling={false}
                          className="text-base font-semibold"
                          style={{ color: colors.foreground }}
                        >
                          {order?.paymentMethod}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center py-2">
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={colors.mutedForeground}
                      />
                      <View className="ml-3 flex-1">
                        <Text
                          allowFontScaling={false}
                          className="text-xs"
                          style={{ color: colors.mutedForeground }}
                        >
                          Data da Venda
                        </Text>
                        <Pressable onPress={() => setIsEditingDate(true)}>
                          {isEditingDate ? (
                            <TextInput
                              allowFontScaling={false}
                              className="text-base font-semibold"
                              style={{ color: colors.foreground }}
                              keyboardType="numeric"
                              value={dateInput}
                              placeholder="DD/MM/AAAA"
                              placeholderTextColor={colors.mutedForeground}
                              onChangeText={(text) =>
                                setDateInput(formatDateInput(text))
                              }
                            />
                          ) : (
                            <View>
                              <Text
                                allowFontScaling={false}
                                className="text-base font-semibold"
                                style={{ color: colors.foreground }}
                              >
                                {localCreatedAt
                                  ? formatDate(localCreatedAt)
                                  : ""}
                              </Text>
                            </View>
                          )}
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Informações de Entrega */}
            {order?.isDelivery && (
              <View className="mb-6">
                <Text
                  allowFontScaling={false}
                  className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: colors.mutedForeground }}
                >
                  Endereço de Entrega
                </Text>
                <View className="rounded-2xl">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={colors.mutedForeground}
                    />
                    <View className="ml-3 flex-1">
                      <Text
                        allowFontScaling={false}
                        className="text-base font-semibold mb-1"
                        style={{ color: colors.foreground }}
                      >
                        {order.deliveryStreet}, {order.deliveryNumber}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Produtos */}
            <View className="mb-6">
              <Text
                allowFontScaling={false}
                className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: colors.mutedForeground }}
              >
                Produtos ({order?.items.length})
              </Text>

              {order?.items.map((item, index) => (
                <View key={item.id}>
                  <View className="flex-row items-center py-3">
                    <Image
                      source={{ uri: item.imgUrl }}
                      className="w-14 h-14 rounded-xl mr-3"
                      style={{ backgroundColor: colors.muted }}
                    />
                    <View className="flex-1">
                      <Text
                        allowFontScaling={false}
                        className="text-base font-semibold mb-1"
                        style={{ color: colors.foreground }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        className="text-sm"
                        style={{ color: colors.mutedForeground }}
                      >
                        {item.quantity}x {formatCurrency(item.price)}
                      </Text>
                    </View>
                    <Text
                      allowFontScaling={false}
                      className="text-lg font-bold"
                      style={{ color: colors.foreground }}
                    >
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </View>
                  {index < (order?.items.length || 0) - 1 && (
                    <View
                      style={{ height: 1, backgroundColor: colors.border }}
                    />
                  )}
                </View>
              ))}

              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginTop: 16,
                  marginBottom: 16,
                }}
              />

              <View className="flex-row items-center justify-between py-2">
                <Text
                  allowFontScaling={false}
                  className="text-lg font-bold"
                  style={{ color: colors.foreground }}
                >
                  Total
                </Text>
                <Text
                  allowFontScaling={false}
                  className="text-3xl font-black"
                  style={{
                    color: order?.status === "approved" ? "#10b981" : "#f59e0b",
                  }}
                >
                  {formatCurrency(order?.total || 0)}
                </Text>
              </View>

              {dateInput !== originalDate && (
                <TouchableOpacity
                  onPress={handleSaveOrderDate}
                  activeOpacity={0.85}
                  disabled={mutationUpdateOrderDate.isPending}
                  className="flex-row items-center justify-center rounded-2xl py-4 mt-4"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 4,
                    backgroundColor: mutationUpdateOrderDate.isPending
                      ? colors.primary + "80"
                      : colors.primary,
                  }}
                >
                  {mutationUpdateOrderDate.isPending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white font-bold">Salvar</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Ações */}
            <View className="flex-row justify-center gap-4 mb-8">
              {/* Confirmar Venda (se pending) */}
              {order?.status === "pending" && (
                <>
                  <TouchableOpacity
                    onPress={handleConfirmSale}
                    activeOpacity={0.85}
                    disabled={mutationConfirmSale.isPending}
                    className="flex-row items-center justify-center rounded-2xl py-4 flex-1 gap-2"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.15,
                      shadowRadius: 6,
                      elevation: 4,
                      backgroundColor: mutationConfirmSale.isPending
                        ? colors.primary + "80"
                        : colors.primary, // deixa mais claro
                    }}
                  >
                    {mutationConfirmSale.isPending ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Text className="text-white font-bold">
                          Confirmar venda
                        </Text>
                        <Ionicons
                          name="checkmark-circle"
                          size={26}
                          color="#fff"
                        />
                      </>
                    )}
                  </TouchableOpacity>

                  {/* WhatsApp */}
                  <TouchableOpacity
                    className="w-16 h-16 rounded-2xl items-center justify-center"
                    style={{
                      backgroundColor: "#25D366",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                    onPress={handleWhatsApp}
                  >
                    <Ionicons name="logo-whatsapp" size={28} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      <Dialog
        description="Error ao deletar a venda"
        title="Error"
        visible={showDialog}
        onConfirm={() => setShowDialog(false)}
        confirmText="Ok"
      />
    </Modal>
  );
}
