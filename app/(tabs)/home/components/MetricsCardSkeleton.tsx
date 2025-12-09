import Skeleton from "@/components/skeleton";
import { View } from "react-native";

export function MetricsCardSkeleton() {
    return (
        <>
            {/* VALOR PRINCIPAL */}
            <View className="flex-row items-start mb-2">
                <Skeleton borderRadius={8} height={40} width={180} />
                <Skeleton
                    borderRadius={999}
                    height={20}
                    width={20}
                    style={{ marginLeft: 12, marginTop: 8 }}
                />
            </View>

            {/* VARIAÇÃO / TREND */}
            <View className="flex-row items-center mb-4">
                <Skeleton borderRadius={6} height={14} width={70} />
                <Skeleton
                    borderRadius={999}
                    height={12}
                    width={12}
                    style={{ marginHorizontal: 6 }}
                />
                <Skeleton borderRadius={6} height={14} width={50} />
                <Skeleton
                    borderRadius={6}
                    height={14}
                    width={80}
                    style={{ marginLeft: 6 }}
                />
            </View>
        </>
    );
}
