import { useState } from "react";
import { Platform, Pressable, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
type InputProps = TextInputProps & {
  name: string;
  isPassword?: boolean;
};

export function InputHidden({ placeholder, isPassword, onChangeText, onBlur, value, }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(isPassword ?? true);

  return (
    <View
      className={
        Platform.OS == "ios" ?
          "relative w-full flex flex-row bg-forenground rounded-xl items-center py-4 px-4"
          :
          "relative w-full flex flex-row bg-forenground rounded-xl items-center py-[1px] px-[8px] "

      }
    >
      <TextInput
        placeholder={placeholder}
        className="flex-1 text-white"
        placeholderTextColor={'#7D7D7D'}
        secureTextEntry={isPasswordVisible}
        onChangeText={onChangeText} // Repassa explicitamente
        onBlur={onBlur} // Repassa explicitamente
        value={value}
      />
      <Pressable
        style={({ pressed }) => ({
          opacity: pressed ? 1 : 1, // Mantém a opacidade em 1 (sem transparência)
        })} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
        <Icon
          name={isPasswordVisible ? "eye-off" : "eye"}
          size={20}
          color={"#fff"}
        />
      </Pressable>
    </View>
  );
}
