// components/ConfirmDialog.tsx

import React from "react";
import { Modal, Pressable } from "react-native";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
} from "@gluestack-ui/themed";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Box flex={1} justifyContent="center" alignItems="center" bg="rgba(0,0,0,0.6)">
        <Box bg="$coolGray800" p="$6" rounded="2xl" width="85%">
          <VStack space="md">
            <Text fontSize="$lg" fontWeight="$bold" color="white">{title}</Text>
            <Text color="$coolGray300">{message}</Text>

            <HStack justifyContent="flex-end" space="sm" mt="$4">
              <Button variant="link" onPress={onCancel}>
                <Text color="$coolGray300">{cancelText}</Text>
              </Button>
              <Button
                bg={destructive ? "$red600" : "$blue600"}
                onPress={onConfirm}
              >
                <Text color="white">{confirmText}</Text>
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Modal>
  );
}
