// context/HeaderActionContext.tsx
import React, { createContext, useContext, useState } from "react";

type HeaderActionContextType = {
  onRightPress?: () => void;
  setOnRightPress: (fn: () => void) => void;
};

const HeaderActionContext = createContext<HeaderActionContextType>({
  onRightPress: undefined,
  setOnRightPress: () => {},
});

export const HeaderActionProvider = ({ children }: { children: React.ReactNode }) => {
  const [onRightPress, setOnRightPress] = useState<() => void>();

  return (
    <HeaderActionContext.Provider value={{ onRightPress, setOnRightPress }}>
      {children}
    </HeaderActionContext.Provider>
  );
};

export const useHeaderAction = () => useContext(HeaderActionContext);
