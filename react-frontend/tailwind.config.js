// tailwind.config.js
module.exports = {
    darkMode: 'class', // ou 'media' si tu veux basé sur les préférences système
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          border: 'var(--border)',
          input: 'var(--input)',
          ring: 'oklch(var(--ring) / <alpha-value>)',
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          primary: {
            DEFAULT: 'var(--primary)',
            foreground: 'var(--primary-foreground)',
          },
          secondary: {
            DEFAULT: 'var(--secondary)',
            foreground: 'var(--secondary-foreground)',
          },
          destructive: {
            DEFAULT: 'var(--destructive)',
            foreground: 'var(--destructive-foreground)',
          },
          muted: {
            DEFAULT: 'var(--muted)',
            foreground: 'var(--muted-foreground)',
          },
          accent: {
            DEFAULT: 'var(--accent)',
            foreground: 'var(--accent-foreground)',
          },
          popover: {
            DEFAULT: 'var(--popover)',
            foreground: 'var(--popover-foreground)',
          },
          card: {
            DEFAULT: 'var(--card)',
            foreground: 'var(--card-foreground)',
          },
          // Thème clair - Gamme G (bleu-gris)
          g50: '#e8edf0',
          g75: '#a0b4c1',
          g100: '#7995a7',
          g200: '#3f6781',
          g300: '#184867',
          g400: '#113248',
          g500: '#0f2c3f',
  
          // Thème clair - Gamme O (orange)
          o50: '#fef2e7',
          o75: '#fdcb9e',
          o100: '#fcb676',
          o200: '#fa963b',
          o300: '#f98113',
          o400: '#ae5a0d',
          o500: '#984f0c',
        }
      },
    },
    plugins: [],
  };
  