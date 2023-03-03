import React, { useState } from "react";
import SpaceinvadersToggle from "./SpaceinvadersToggle";

export default {
  title: "Components/SpaceinvadersToggle",
  component: SpaceinvadersToggle,
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => setIsChecked(!isChecked);

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <SpaceinvadersToggle checked={isChecked} onChange={toggle} />
      </div>
      <div style={{ marginBottom: "32px" }}>
        <SpaceinvadersToggle checked={isChecked} onChange={toggle} scale="md" />
      </div>
      <div>
        <SpaceinvadersToggle checked={isChecked} onChange={toggle} scale="sm" />
      </div>
    </>
  );
};
