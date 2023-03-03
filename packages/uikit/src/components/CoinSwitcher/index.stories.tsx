import React from "react";
import { SequencePlayer } from "./SequencePlayer";
import { bnb2InvaImages, inva2BnbImages } from "./constant";

export default {
  title: "Components/CoinSwitcher",
  component: SequencePlayer,
  argTypes: {},
};

export const Bnb2Inva: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <SequencePlayer images={bnb2InvaImages()} />
    </div>
  );
};

export const Inva2Bnb: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <SequencePlayer images={inva2BnbImages()} />
    </div>
  );
};
