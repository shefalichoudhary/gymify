import React, { useCallback, useMemo, forwardRef } from "react";
import { Text } from "@gluestack-ui/themed";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

type CustomBottomSheetProps = {
  children?: React.ReactNode;
  snapPoints?: (string | number)[];
  scrollable?: boolean; // optional flag
  onChange?: (index: number) => void; // optional callback
};

const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(
  ({ children, snapPoints,onChange }, ref) => {
    const snapPointsMemo = useMemo(() => snapPoints ?? ["50%"], [snapPoints]);

       const handleSheetChange = useCallback(
      (index: number) => {
        onChange?.(index); // notify parent
      },
      [onChange]
    );


    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        enablePanDownToClose={true}
        snapPoints={snapPointsMemo}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#1F1F1F" }}
        handleIndicatorStyle={{
          backgroundColor: "#888",
          height: 4,
          width: 50,
          borderRadius: 2,
        }}
        handleStyle={{
          backgroundColor: "#1F1F1F",
          paddingVertical: 6,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        {/* Directly render whatever was passed */}
        {children || <Text>Bottom Sheet Content</Text>}
      </BottomSheet>
    );
  }
);

export default CustomBottomSheet;
