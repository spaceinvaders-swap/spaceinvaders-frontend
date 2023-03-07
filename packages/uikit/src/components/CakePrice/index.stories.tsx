import React from "react";
import { RotoPrice, RotoPriceProps } from ".";
import { Flex } from "../Box";

export default {
  title: "Components/RotoPrice",
  component: RotoPrice,
};

const Template: React.FC<React.PropsWithChildren<RotoPriceProps>> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <RotoPrice {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  rotoPriceUsd: 20.0,
};
