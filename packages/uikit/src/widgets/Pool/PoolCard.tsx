import { useTranslation } from "@offsideswap/localization";
import { ReactElement } from "react";
import { Flex } from "../../components/Box";
import { CardBody, CardRibbon } from "../../components/Card";
import { Skeleton } from "../../components/Skeleton";
import { PoolCardHeader, PoolCardHeaderTitle } from "./PoolCardHeader";
import { StyledCard } from "./StyledCard";
import { DeserializedPool } from "./types";

interface PoolCardPropsType<T> {
  pool: DeserializedPool<T>;
  cardContent: ReactElement;
  aprRow: ReactElement;
  cardFooter: ReactElement;
  tokenPairImage: ReactElement;
  isStaked: boolean;
}

export function PoolCard<T>({ pool, cardContent, aprRow, isStaked, cardFooter, tokenPairImage }: PoolCardPropsType<T>) {
  const { sousId, stakingToken, earningToken, isFinished, totalStaked } = pool;
  const { t } = useTranslation();

  const isRotoPool = earningToken?.symbol === "ROTO" && stakingToken?.symbol === "ROTO";

  return (
    <StyledCard
      isActive={isRotoPool}
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t("Finished")} />}
    >
      <PoolCardHeader isStaking={isStaked} isFinished={isFinished && sousId !== 0}>
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <PoolCardHeaderTitle
              title={isRotoPool ? t("Manual") : t("Earn %asset%", { asset: earningToken?.symbol || "" })}
              subTitle={
                isRotoPool ? t("Earn ROTO, stake ROTO") : t("Stake %symbol%", { symbol: stakingToken?.symbol || "" })
              }
            />
            {tokenPairImage}
          </>
        ) : (
          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column">
              <Skeleton width={100} height={26} mb="4px" />
              <Skeleton width={65} height={20} />
            </Flex>
            <Skeleton width={58} height={58} variant="circle" />
          </Flex>
        )}
      </PoolCardHeader>
      <CardBody>
        {aprRow}
        <Flex mt="24px" flexDirection="column">
          {cardContent}
        </Flex>
      </CardBody>
      {cardFooter}
    </StyledCard>
  );
}
