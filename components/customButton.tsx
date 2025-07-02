import React from "react";
import { Button, ButtonText, Box } from "@gluestack-ui/themed";

type CustomButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  icon?: React.ReactElement | null;
  iconPosition?: "left" | "right";
  [key: string]: any;
};

export default function CustomButton({
  onPress,
  children,
  icon = null,
  iconPosition = "right",
  ...props
}: CustomButtonProps) {
  return (
    <Button
      bg="$yellow400"
      borderRadius="$xl"
      onPress={onPress}
      flexDirection="row"
      px="$8"
      py="$2"
      alignItems="center"
      justifyContent="center"
      w="100%"
      {...props}
    >
      {icon && iconPosition === "left" && (
        <Box mr="$2">{icon}</Box> // 👈 marginRight wrapper
      )}

      <ButtonText
        color="$white"
        
        fontWeight="$medium"
        fontSize="$md"
      >
        {children}
      </ButtonText>

      {icon && iconPosition === "right" && (
        <Box ml="$1">{icon}</Box> // 👈 marginLeft wrapper
      )}
    </Button>
  );
}
