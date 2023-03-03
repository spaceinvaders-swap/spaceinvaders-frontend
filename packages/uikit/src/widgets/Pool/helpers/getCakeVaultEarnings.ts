import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@spaceinvaders-swap/utils/bigNumber";
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from "@spaceinvaders-swap/utils/formatBalance";

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000);

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000);

export const convertSharesToInva = (
  shares: BigNumber,
  invaPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber
) => {
  const sharePriceNumber = getBalanceNumber(invaPerFullShare, decimals);
  const amountInInva = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO);
  const invaAsNumberBalance = getBalanceNumber(amountInInva, decimals);
  const invaAsBigNumber = getDecimalAmount(new BigNumber(invaAsNumberBalance), decimals);
  const invaAsDisplayBalance = getFullDisplayBalance(amountInInva, decimals, decimalsToRound);
  return { invaAsNumberBalance, invaAsBigNumber, invaAsDisplayBalance };
};

export const getInvaVaultEarnings = (
  account: string,
  invaAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber
) => {
  const hasAutoEarnings = account && invaAtLastUserAction?.gt(0) && userShares?.gt(0);
  const { invaAsBigNumber } = convertSharesToInva(userShares, pricePerFullShare);
  const autoInvaProfit = invaAsBigNumber.minus(fee || BIG_ZERO).minus(invaAtLastUserAction);
  const autoInvaToDisplay = autoInvaProfit.gte(0) ? getBalanceNumber(autoInvaProfit, 18) : 0;

  const autoUsdProfit = autoInvaProfit.times(earningTokenPrice);
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0;
  return { hasAutoEarnings, autoInvaToDisplay, autoUsdToDisplay };
};

export default getInvaVaultEarnings;
