import React from "react";
import { OffsideStack, OffsideInput, OffsideLabel } from "./StyledOffsideToggle";
import { OffsideToggleProps, scales } from "./types";

const OffsideToggle: React.FC<React.PropsWithChildren<OffsideToggleProps>> = ({
  checked,
  scale = scales.LG,
  ...props
}) => (
  <OffsideStack scale={scale}>
    <OffsideInput id={props.id || "offside-toggle"} scale={scale} type="checkbox" checked={checked} {...props} />
    <OffsideLabel scale={scale} checked={checked} htmlFor={props.id || "offside-toggle"}>
      <div className="offsides">
        <div className="offside" />
        <div className="offside" />
        <div className="offside" />
        <div className="butter" />
      </div>
    </OffsideLabel>
  </OffsideStack>
);

export default OffsideToggle;
