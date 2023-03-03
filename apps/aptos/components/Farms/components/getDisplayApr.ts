export const getDisplayApr = (invaRewardsApr?: number, lpRewardsApr?: number) => {
  if (invaRewardsApr && lpRewardsApr) {
    return (invaRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (invaRewardsApr) {
    return invaRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
