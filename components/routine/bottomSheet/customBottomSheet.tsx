// components/bottomSheets/CustomBottomSheet.tsx

import React, { useCallback, useMemo, forwardRef } from "react";
import { Text } from "@gluestack-ui/themed";
import BottomSheet, {
  BottomSheetView,
   BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";


type CustomBottomSheetProps = {
  children?: React.ReactNode;
    snapPoints?: (string | number)[]; 
};

// ✅ Use typeof BottomSheet for the ref
const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(
({ children, snapPoints }, ref) => {
    const snapPointsMemo = useMemo(() => snapPoints ?? ["50%"], [snapPoints]);

    const handleSheetChange = useCallback((index: number) => {
      console.log("Sheet changed to index", index);
    }, []);
     const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close" 
            // 👈 Dismiss sheet when tapping outside
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1} // hidden by default
  enablePanDownToClose={true} 
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
           backdropComponent={renderBackdrop} 
            backgroundStyle={{ backgroundColor: "#1F1F1F" }}
        handleIndicatorStyle={{ backgroundColor: "#888" , height: 4, width: 50, borderRadius: 2 ,}}
        handleStyle={{ backgroundColor: "#1F1F1F", paddingVertical: 6, borderTopLeftRadius: 24, borderTopRightRadius: 24}}
      >
        <BottomSheetView style={{ flex:1 }}>
          {children || <Text>Bottom Sheet Content</Text>}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default CustomBottomSheet;
