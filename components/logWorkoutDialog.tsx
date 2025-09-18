import React from "react";
import { Button, Text, HStack, Box } from "@gluestack-ui/themed";
import { AlertDialog } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

type ConfirmDialogProps = {
  visible: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  visible,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog isOpen={visible} onClose={onCancel}>
      {/* Blurred backdrop */}
      <AlertDialog.Backdrop>
        <BlurView intensity={90} tint="dark" style={{ flex: 1 }} />
      </AlertDialog.Backdrop>

      {/* Dialog content */}
      <AlertDialog.Content
        bg="rgba(28,28,30,0.95)" 
        borderWidth={0}
        rounded="3xl"
        px="$4"
        py="$4"
        w="75%"
        alignSelf="center"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 6 }}
        shadowOpacity={0.35}
        shadowRadius={12}
        elevation={8}
      >
        {/* Icon */}
        <Box alignItems="center" mb="$3">
          <Ionicons
            name={destructive ? "warning-outline" : "information-circle-outline"}
            size={36}
            color={destructive ? "#F87171" : "#60A5FA"}
          />
        </Box>

        {/* Message */}
        <AlertDialog.Body>
          <Text
            fontSize="$md"
            color="$coolGray100"
            textAlign="center"
            lineHeight={22}
          >
            {message}
          </Text>
        </AlertDialog.Body>

        {/* Buttons */}
        <AlertDialog.Footer mt="$4">
          <HStack space="xs" justifyContent="center">
            {/* Cancel */}
            <Button
              variant="outline"
              rounded="2xl"
              flex={1}
              onPress={onCancel}
              bg="rgba(255,255,255,0.1)"
              borderWidth={0}
            >
              <HStack space="xs" alignItems="center" justifyContent="center">
                <Ionicons name="close" size={14} color="#D1D5DB" />
                <Text color="$coolGray200" fontSize="$sm" fontWeight="medium">
                  {cancelText}
                </Text>
              </HStack>
            </Button>

            {/* Confirm */}
            <Button
              rounded="xl"
              flex={1}
              onPress={onConfirm}
              bg={destructive ? "#F87171" : "$blue500"}
            >
              <HStack space="xs" alignItems="center" justifyContent="center">
                <Ionicons
                  name={destructive ? "trash-outline" : "checkmark"}
                  size={14}
                  color="white"
                />
                <Text color="white" fontSize="$sm" fontWeight="semibold">
                  {confirmText}
                </Text>
              </HStack>
            </Button>
          </HStack>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
