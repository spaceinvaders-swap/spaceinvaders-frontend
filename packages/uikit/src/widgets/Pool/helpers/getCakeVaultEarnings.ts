import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@offsideswap/utils/bigNumber";
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from "@offsideswap/utils/formatBalance";

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000);

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000);

export const convertSharesToRoto = (
  shares: BigNumber,
  rotoPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber
) => {
  const sharePriceNumber = getBalanceNumber(rotoPerFullShare, decimals);
  const amountInRoto = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO);
  const rotoAsNumberBalance = getBalanceNumber(amountInRoto, decimals);
  const rotoAsBigNumber = getDecimalAmount(new BigNumber(rotoAsNumberBalance), decimals);
  const rotoAsDisplayBalance = getFullDisplayBalance(amountInRoto, decimals, decimalsToRound);
  return { rotoAsNumberBalance, rotoAsBigNumber, rotoAsDisplayBalance };
};

export const getRotoVaultEarnings = (
  account: string,
  rotoAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber
) => {
  const hasAutoEarnings = account && rotoAtLastUserAction?.gt(0) && userShares?.gt(0);
  const { rotoAsBigNumber } = convertSharesToRoto(userShares, pricePerFullShare);
  const autoRotoProfit = rotoAsBigNumber.minus(fee || BIG_ZERO).minus(rotoAtLastUserAction);
  const autoRotoToDisplay = autoRotoProfit.gte(0) ? getBalanceNumber(autoRotoProfit, 18) : 0;

  const autoUsdProfit = autoRotoProfit.times(earningTokenPrice);
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0;
  return { hasAutoEarnings, autoRotoToDisplay, autoUsdToDisplay };
};

export default getRotoVaultEarnings;
