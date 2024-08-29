import LeanDocument from '@/interfaces/LeanDocument'
import PlainDocument from '@/interfaces/PlainDocument'
const convertToPlainDocument: Function = (leanDocument: LeanDocument): PlainDocument => {
  for (const key of Object.keys(leanDocument)) {
    if (leanDocument[key].toJSON && leanDocument[key].toString) {
      leanDocument[key] = leanDocument[key].toString()
    } else {
      convertToPlainDocument(leanDocument[key])
    }
  }
  return leanDocument
}
export default convertToPlainDocument