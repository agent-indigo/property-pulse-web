import type {Config} from 'tailwindcss'
import { CustomThemeConfig } from 'tailwindcss/types/config'
const tailwindConfig: Config = {
  content: ['**/*.tsx' as string] as string[],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins' as string, 'sans-serif' as string] as string[]
      } as Partial<CustomThemeConfig>,
      gridTemplateColumns: {
        '70/30': '70% 28%' as string
      } as Partial<CustomThemeConfig>
    } as Partial<CustomThemeConfig>
  } as Partial<CustomThemeConfig>
}
export default tailwindConfig as Config