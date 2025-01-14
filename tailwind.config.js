/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(180deg, #FFFFFF -22.22%, #1DAEDE 100%)',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-10px)' },
        },
        pulsate: {
          '0%': { transform: 'scale(0.1)', opacity: '0.0' },
          '50%': { opacity: '1.0' },
          '100%': { transform: 'scale(1.2)', opacity: '0.0' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.3s ease-out forwards',
        slideUp: 'slideUp 0.3s ease-in forwards',
        pulsate: 'pulsate 1s ease-out infinite',
      },
      colors: {
        'custom-light-blue': 'rgba(29, 174, 222, 0.05)',
        'primary-blue': '#1DAEDE',
        'secondry-blue':'#4dd0fc'
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.switch': {
          position: 'relative',
          display: 'inline-block',
          width: '50px',
          height: '20px',
        },
        '.switch input': {
          opacity: '0',
          width: '0',
          height: '0',
        },
        '.slider': {
          position: 'absolute',
          cursor: 'pointer',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: '#ccc',
          transition: '0.4s',
          borderRadius: '20px',
        },
        '.slider:before': {
          position: 'absolute',
          content: '""',
          height: '14px',
          width: '14px',
          left: '3px',
          bottom: '3px',
          backgroundColor: 'white',
          transition: '0.4s',
          borderRadius: '50%',
        },
        'input:checked + .slider': {
          backgroundColor: '#1DAEDE',
        },
        'input:checked + .slider:before': {
          transform: 'translateX(27px)',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
