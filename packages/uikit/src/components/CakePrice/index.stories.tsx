import React from "react";
import { InvaPrice, InvaPriceProps } from ".";
import { Flex } from "../Box";

export default {
  title: "Components/InvaPrice",
  component: InvaPrice,
};

const Template: React.FC<React.PropsWithChildren<InvaPriceProps>> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <InvaPrice {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  invaPriceUsd: 20.0,
};
