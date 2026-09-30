export default interface PropertySearchQuery {
  $or?: Array<{
    name?: RegExp
    description?: RegExp
    'location.street'?: RegExp
    'location.city'?: RegExp
    'location.state'?: RegExp
    'location.zipcode'?: RegExp
  }>
  type?: RegExp
}