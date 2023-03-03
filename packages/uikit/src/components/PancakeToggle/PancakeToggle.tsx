import React from "react";
import { SpaceinvadersStack, SpaceinvadersInput, SpaceinvadersLabel } from "./StyledSpaceinvadersToggle";
import { SpaceinvadersToggleProps, scales } from "./types";

const SpaceinvadersToggle: React.FC<React.PropsWithChildren<SpaceinvadersToggleProps>> = ({
  checked,
  scale = scales.LG,
  ...props
}) => (
  <SpaceinvadersStack scale={scale}>
    <SpaceinvadersInput id={props.id || "spaceinvaders-toggle"} scale={scale} type="checkbox" checked={checked} {...props} />
    <SpaceinvadersLabel scale={scale} checked={checked} htmlFor={props.id || "spaceinvaders-toggle"}>
      <div className="spaceinvaderss">
        <div className="spaceinvaders" />
        <div className="spaceinvaders" />
        <div className="spaceinvaders" />
        <div className="butter" />
      </div>
    </SpaceinvadersLabel>
  </SpaceinvadersStack>
);

export default SpaceinvadersToggle;
