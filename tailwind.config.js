export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {

      colors: {
        'gigs-green': '#1dbf73',
        'gigs-gray': {

          light: '#f5f5f5',
          medium: '#e0e0e0',
          dark: '#62646a',
        },
      },
    },

    container: {
      center: true,
      padding: '1rem',
      screens: {

        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px', 

      },
    },
  },
  plugins: [],
}
