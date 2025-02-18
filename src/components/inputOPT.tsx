import React, { useState, useRef } from "react";
import { View, TextInput, TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  onChangeText: (value: string) => void;
};

const InputOPT = ({ onChangeText, onBlur, value }: InputProps) => {
  const length = 6;
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^[a-zA-Z0-9]*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Chama onChangeText com o valor completo do OTP
    onChangeText(newOtp.join(""));

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex flex-row justify-center mt-10">
      {otp.map((char, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          value={char}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="default"
          maxLength={1}
          onBlur={onBlur}
          className="w-[40] h-[50] bg-forenground text-center rounded-xl mx-3 text-white"
        />
      ))}
    </View>
  );
};

export default InputOPT;
