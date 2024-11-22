import React from 'react';
import { View } from 'react-native';

interface SeparatorProps {
    // Personalize as propriedades do separador, como a cor ou a espessura
    height?: number;
    color?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ height = 1, color = '#ccc' }) => {
    return (
        <View
            style={{
                height,
                backgroundColor: color,
                width: '100%',
            }}
        />
    );
};
