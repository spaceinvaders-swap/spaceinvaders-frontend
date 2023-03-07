import React from "react";
import { SequencePlayer } from "./SequencePlayer";
import { bnb2RotoImages, roto2BnbImages } from "./constant";

export default {
  title: "Components/CoinSwitcher",
  component: SequencePlayer,
  argTypes: {},
};

export const Bnb2Roto: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <SequencePlayer images={bnb2RotoImages()} />
    </div>
  );
};

export const Roto2Bnb: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <SequencePlayer images={roto2BnbImages()} />
    </div>
  );
};
