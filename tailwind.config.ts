import type {Config} from 'tailwindcss'
const config: Config = {
  content: ['**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%'
      }
    }
  }
}
export default config