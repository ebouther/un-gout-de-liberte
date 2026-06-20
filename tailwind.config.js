module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './content/**/*.md',
    './app.vue',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  plugins: [require('tw-elements/dist/plugin.cjs')],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#F4EFE8',
        gold: {
          DEFAULT: '#B88645',
          dark: '#9A7239',
        },
        sage: '#5A7D63',
        line: '#D6CEC2',
        espresso: '#1C1814',
        textbody: '#4D4740',
      }
    }
  },
  variants: {}
}
