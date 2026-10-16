import PropertyRates from '@/types/PropertyRates'
const getRateDisplay: Function = (rates: PropertyRates): string | undefined => {
  const {
    nightly,
    weekly,
    monthly
  }: PropertyRates = rates
  if (nightly) {
    return `${nightly.toLocaleString()}/night`
  } else if (weekly) {
    return `${weekly.toLocaleString()}/week`
  } else if (monthly) {
    return `${monthly.toLocaleString()}/month`
  }
}
export default getRateDisplay