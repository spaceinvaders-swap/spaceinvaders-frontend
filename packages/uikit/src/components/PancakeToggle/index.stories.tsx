import React, { useState } from "react";
import OffsideToggle from "./OffsideToggle";

export default {
  title: "Components/OffsideToggle",
  component: OffsideToggle,
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => setIsChecked(!isChecked);

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <OffsideToggle checked={isChecked} onChange={toggle} />
      </div>
      <div style={{ marginBottom: "32px" }}>
        <OffsideToggle checked={isChecked} onChange={toggle} scale="md" />
      </div>
      <div>
        <OffsideToggle checked={isChecked} onChange={toggle} scale="sm" />
      </div>
    </>
  );
};
