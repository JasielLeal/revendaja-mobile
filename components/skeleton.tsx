import React, { useEffect } from "react";
import { DimensionValue, ViewStyle } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    interpolate,
} from "react-native-reanimated";

interface Props {
    width?: number | DimensionValue;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export default function Skeleton({
    width = "100%",
    height = 20,
    borderRadius = 8,
    style,
}: Props) {

    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(shimmer.value, [0, 1], [0.5, 1]);
        return {
            opacity,
        };
    });
    return (
        <Animated.View
            style={[
                {
                    backgroundColor: "#e5e7eb",
                    width,
                    height,
                    borderRadius,
                },
                animatedStyle,
                style,
            ]}
        />
    );
}