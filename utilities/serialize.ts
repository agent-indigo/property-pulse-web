const serialize: Function = (leanDocument: any): any => {
  for (const key of Object.keys(leanDocument)) {
    if (leanDocument[key].toJSON && leanDocument[key].toString) {
      leanDocument[key] = leanDocument[key].toString()
    }
  }
  return leanDocument
}
export default serialize