import React from "react";
import { Image, Box } from "@spaceinvaders-swap/uikit";
import { SpinnerProps } from "./types";

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Box width={size} height={size * 1.197} position="relative">
      <Image
        width={size}
        height={size * 1.197}
        src="https://assets.spaceinvaders-swap.finance/web/spaceinvaders-3d-spinner-v2.gif"
        alt="spaceinvaders-3d-spinner"
      />
    </Box>
  );
};

export default Spinner;
