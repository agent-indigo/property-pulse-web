import {Config} from 'tailwindcss'
const tailwindConfig: Config = {
  content: [
    'app/**/*.tsx',
    'components/**/*.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Poppins',
          'sans-serif'
        ]
      },
      gridTemplateColumns: {
        '70/30': '70% 28%'
      }
    }
  }
}
export default tailwindConfig