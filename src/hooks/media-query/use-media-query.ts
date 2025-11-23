import { useEffect, useState } from "react";
import { getScreenSize, ScreenSizeEnum } from "@/utils/browser/get-screen-size";

export const useMediaQuery = () => {
  const [screenSize, setScreenSize] = useState<ScreenSizeEnum>(getScreenSize());

  const handleResize = () => {
    setScreenSize(getScreenSize());
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // Limpia el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setScreenSize]);

  return screenSize
;
};
