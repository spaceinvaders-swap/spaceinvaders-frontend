import { useTranslation } from "@spaceinvaders-swap/localization";
import styled from "styled-components";
import { Text } from "../../../../components/Text";
import { HelpIcon } from "../../../../components/Svg";
import { Skeleton } from "../../../../components/Skeleton";
import { useTooltip } from "../../../../hooks/useTooltip";
import { FarmTableMultiplierProps } from "../../types";
import { Link } from "../../../../components/Link";

const ReferenceElement = styled.div`
  display: inline-block;
`;

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Multiplier: React.FunctionComponent<React.PropsWithChildren<FarmTableMultiplierProps>> = ({
  multiplier,
  rewardInvaPerSecond,
}) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />;
  const { t } = useTranslation();
  const tooltipContent = (
    <>
      {rewardInvaPerSecond ? (
        <>
          <Text>
            {t(
              "The Multiplier represents the proportion of INVA rewards each farm receives, as a proportion of the INVA produced each second."
            )}
          </Text>
          <Text my="24px">
            {" "}
            {t("For example, if a 1x farm received 1 INVA per second, a 40x farm would receive 40 INVA per second.")}
          </Text>
          <Text>{t("This amount is already included in all APR calculations for the farm.")}</Text>
        </>
      ) : (
        <>
          <Text>
            {t(
              "The Multiplier represents the proportion of INVA rewards each farm receives, as a proportion of the INVA produced each block."
            )}
          </Text>
          <Text my="24px">
            {" "}
            {t("For example, if a 1x farm received 1 INVA per block, a 40x farm would receive 40 INVA per block.")}
          </Text>
          <Text>
            {t(
              "We have recently rebased multipliers by a factor of 10, this is only a visual change and does not affect the amount of INVA each farm receives."
            )}
          </Text>
          <Link
            mt="8px"
            display="inline"
            href="https://medium.com/spaceinvaders-swap/farm-mutlipliers-visual-update-1f5f5f615afd"
            external
          >
            {t("Read more")}
          </Link>
        </>
      )}
    </>
  );
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: "top-end",
    tooltipOffset: [20, 10],
  });

  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  );
};

export default Multiplier;
