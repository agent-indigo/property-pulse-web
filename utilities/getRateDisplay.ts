import PropertyRates from '@/interfaces/PropertyRates'
const getRateDisplay: Function = (
  rates: PropertyRates
): string | undefined => {
  if (rates.monthly) {
    return `${rates.monthly?.toLocaleString()}/mo`
  } else if (rates.weekly) {
    return `${rates.weekly?.toLocaleString()}/wk`
  } else if (rates.nightly) {
    return `${rates.nightly?.toLocaleString()}/night`
  }
}
export default getRateDisplay