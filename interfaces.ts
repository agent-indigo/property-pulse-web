import {ReactNode} from "react"
interface ButtonInfo {
  link: string
  text: string
  backgroundColor: string
}
export interface InfoBoxProps {
  heading: string
  backgroundColor?: string
  textColor?: string
  buttonInfo: ButtonInfo
  children: ReactNode
}
interface Rates {
  weekly?: number
  monthly?: number
  nightly?: number
}
interface Location {
  city: string
  state: string
}
export interface Property {
  _id: string
  images: string[]
  type: string
  name: string
  beds: number
  baths: number
  square_feet: number
  rates: Rates
  location: Location
}