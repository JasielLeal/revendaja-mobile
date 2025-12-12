import Skeleton from "@/components/skeleton";
import React from "react";
import { View } from "react-native";

/**
 * Skeleton para Notificações no Modal
 */
export function NotificationsSkeleton() {
    return (
        <View className="gap-3 p-3">
            {[...Array(3)].map((_, index) => (
                <View
                    key={index}
                    className="mx-3 my-2 flex-row items-center p-4 rounded-2xl bg-gray-100 dark:bg-gray-800"
                >
                    {/* Ícone */}
                    <Skeleton
                        borderRadius={999}
                        height={48}
                        width={48}
                        style={{ marginRight: 16 }}
                    />

                    {/* Conteúdo */}
                    <View className="flex-1">
                        <Skeleton
                            borderRadius={6}
                            height={16}
                            width={200}
                            style={{ marginBottom: 8 }}
                        />
                        <Skeleton
                            borderRadius={6}
                            height={14}
                            width={150}
                        />
                    </View>

                    {/* Botão */}
                    <Skeleton
                        borderRadius={999}
                        height={20}
                        width={20}
                        style={{ marginLeft: 12 }}
                    />
                </View>
            ))}
        </View>
    );
}

/**
 * Skeleton para Cards de Métricas (Dashboard)
 */
export function MetricsSkeletons() {
    return (
        <View className="p-5">
            {/* Valor grande */}
            <Skeleton
                borderRadius={6}
                height={40}
                width={280}
                style={{ marginBottom: 12 }}
            />

            {/* Percentual */}
            <View className="flex-row items-center">
                <Skeleton borderRadius={6} height={16} width={150} />
            </View>
        </View>
    );
}

/**
 * Skeleton para Item de Venda (Recent Sales / Sales List)
 */
export function SaleItemSkeleton() {
    return (
        <View className="flex-row items-center justify-between py-3">
            {/* Esquerda */}
            <View className="flex-1">
                <View className="flex-row items-center mb-3">
                    {/* Ícone */}
                    <Skeleton
                        borderRadius={12}
                        height={44}
                        width={44}
                        style={{ marginRight: 12 }}
                    />

                    {/* Textos */}
                    <View className="flex-1">
                        <Skeleton
                            borderRadius={6}
                            height={14}
                            width={140}
                            style={{ marginBottom: 6 }}
                        />
                        <Skeleton
                            borderRadius={6}
                            height={12}
                            width={100}
                            style={{ marginBottom: 6 }}
                        />
                        <Skeleton borderRadius={999} height={20} width={80} />
                    </View>
                </View>
            </View>

            {/* Direita (valor) */}
            <View className="items-end">
                <Skeleton
                    borderRadius={6}
                    height={18}
                    width={90}
                    style={{ marginBottom: 6 }}
                />
                <Skeleton borderRadius={6} height={12} width={70} />
            </View>
        </View>
    );
}

/**
 * Skeleton para Produto (Store List)
 */
export function ProductSkeleton() {
    return (
        <View className="mb-4">
            {/* Imagem */}
            <Skeleton
                borderRadius={12}
                height={200}
                width="100%"
                style={{ marginBottom: 12 }}
            />

            {/* Info */}
            <Skeleton
                borderRadius={6}
                height={16}
                width={150}
                style={{ marginBottom: 8 }}
            />
            <Skeleton
                borderRadius={6}
                height={14}
                width={200}
                style={{ marginBottom: 8 }}
            />

            {/* Preço e Status */}
            <View className="flex-row justify-between">
                <Skeleton borderRadius={6} height={18} width={80} />
                <Skeleton borderRadius={6} height={18} width={60} />
            </View>
        </View>
    );
}

/**
 * Skeleton para Lista de Produtos (Grid)
 */
export function ProductGridSkeleton() {
    return (
        <View className="gap-3">
            {[...Array(6)].map((_, index) => (
                <View key={index} className="mb-4">
                    <Skeleton
                        borderRadius={12}
                        height={180}
                        width="100%"
                        style={{ marginBottom: 12 }}
                    />
                    <Skeleton
                        borderRadius={6}
                        height={14}
                        width={140}
                        style={{ marginBottom: 6 }}
                    />
                    <Skeleton
                        borderRadius={6}
                        height={12}
                        width={180}
                        style={{ marginBottom: 8 }}
                    />
                    <View className="flex-row justify-between">
                        <Skeleton borderRadius={6} height={16} width={70} />
                        <Skeleton borderRadius={6} height={16} width={50} />
                    </View>
                </View>
            ))}
        </View>
    );
}

/**
 * Skeleton para Detalhe de Venda (Order Details Modal)
 */
export function OrderDetailsSkeleton() {
    return (
        <View className="gap-4">
            {/* Header Info */}
            <View className="mb-4">
                <Skeleton
                    borderRadius={6}
                    height={16}
                    width={200}
                    style={{ marginBottom: 8 }}
                />
                <Skeleton borderRadius={6} height={24} width={150} />
            </View>

            {/* Items */}
            <View className="gap-3">
                {[...Array(3)].map((_, index) => (
                    <View key={index} className="flex-row gap-3">
                        <Skeleton borderRadius={8} height={60} width={60} />
                        <View className="flex-1">
                            <Skeleton
                                borderRadius={6}
                                height={14}
                                width={150}
                                style={{ marginBottom: 6 }}
                            />
                            <Skeleton borderRadius={6} height={12} width={100} />
                        </View>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View className="mt-4 border-t border-gray-200 pt-4">
                <Skeleton
                    borderRadius={6}
                    height={18}
                    width={120}
                    style={{ marginBottom: 4 }}
                />
                <Skeleton borderRadius={6} height={24} width={100} />
            </View>
        </View>
    );
}
