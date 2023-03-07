export const getDisplayApr = (rotoRewardsApr?: number, lpRewardsApr?: number) => {
  if (rotoRewardsApr && lpRewardsApr) {
    return (rotoRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (rotoRewardsApr) {
    return rotoRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
