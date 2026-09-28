/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(248, 98%, 97%)',
            '100': 'hsl(248, 98%, 94%)',
            '200': 'hsl(248, 98%, 86%)',
            '300': 'hsl(248, 98%, 76%)',
            '400': 'hsl(248, 98%, 64%)',
            '500': 'hsl(248, 98%, 50%)',
            '600': 'hsl(248, 98%, 40%)',
            '700': 'hsl(248, 98%, 32%)',
            '800': 'hsl(248, 98%, 24%)',
            '900': 'hsl(248, 98%, 16%)',
            '950': 'hsl(248, 98%, 10%)',
            DEFAULT: '#533afd'
        },
        secondary: {
            '50': 'hsl(19, 100%, 97%)',
            '100': 'hsl(19, 100%, 94%)',
            '200': 'hsl(19, 100%, 86%)',
            '300': 'hsl(19, 100%, 76%)',
            '400': 'hsl(19, 100%, 64%)',
            '500': 'hsl(19, 100%, 50%)',
            '600': 'hsl(19, 100%, 40%)',
            '700': 'hsl(19, 100%, 32%)',
            '800': 'hsl(19, 100%, 24%)',
            '900': 'hsl(19, 100%, 16%)',
            '950': 'hsl(19, 100%, 10%)',
            DEFAULT: '#ff6118'
        },
        accent: {
            '50': 'hsl(151, 100%, 97%)',
            '100': 'hsl(151, 100%, 94%)',
            '200': 'hsl(151, 100%, 86%)',
            '300': 'hsl(151, 100%, 76%)',
            '400': 'hsl(151, 100%, 64%)',
            '500': 'hsl(151, 100%, 50%)',
            '600': 'hsl(151, 100%, 40%)',
            '700': 'hsl(151, 100%, 32%)',
            '800': 'hsl(151, 100%, 24%)',
            '900': 'hsl(151, 100%, 16%)',
            '950': 'hsl(151, 100%, 10%)',
            DEFAULT: '#00d66f'
        },
        'neutral-50': '#000000',
        'neutral-100': '#50617a',
        'neutral-200': '#ffffff',
        'neutral-300': '#64748d',
        'neutral-400': '#7d8ba4',
        'neutral-500': '#101010',
        'neutral-600': '#f2f7fe',
        background: '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'sohne-var',
            'sans-serif'
        ]
    },
    fontSize: {
        '8': [
            '8px',
            {
                lineHeight: '8.96px'
            }
        ],
        '9': [
            '9px',
            {
                lineHeight: 'normal'
            }
        ],
        '10': [
            '10px',
            {
                lineHeight: '15px',
                letterSpacing: '0.1px'
            }
        ],
        '11': [
            '11px',
            {
                lineHeight: '16px'
            }
        ],
        '12': [
            '12px',
            {
                lineHeight: 'normal'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '14px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '18': [
            '18px',
            {
                lineHeight: '25.2px'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '28px',
                letterSpacing: '-0.2px'
            }
        ],
        '22': [
            '22px',
            {
                lineHeight: '24.2px',
                letterSpacing: '-0.22px'
            }
        ],
        '26': [
            '26px',
            {
                lineHeight: 'normal'
            }
        ],
        '32': [
            '32px',
            {
                lineHeight: '35.2px',
                letterSpacing: '-0.64px'
            }
        ],
        '48': [
            '48px',
            {
                lineHeight: '55.2px',
                letterSpacing: '-0.96px'
            }
        ],
        '56': [
            '56px',
            {
                lineHeight: '57.68px',
                letterSpacing: '-1.4px'
            }
        ]
    },
    spacing: {
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '13': '52px',
        '15': '60px',
        '16': '64px',
        '18': '72px',
        '20': '80px',
        '24': '96px',
        '85': '340px',
        '1px': '1px',
        '325px': '325px'
    },
    borderRadius: {
        xs: '1px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '100px'
    },
    boxShadow: {
        xs: 'rgba(23, 23, 23, 0.06) 0px 3px 6px 0px',
        sm: 'rgba(0, 0, 0, 0.06) 0px 4px 24px 0px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px',
        md: 'rgba(50, 50, 93, 0.12) 0px 16px 32px 0px',
        lg: 'rgba(0, 0, 0, 0.1) 0px 30px 60px -50px, rgba(50, 50, 93, 0.25) 0px 30px 60px -10px'
    },
    transitionDuration: {
        '0': '0s',
        '100': '0.1s',
        '120': '0.12s',
        '150': '0.15s',
        '200': '0.2s',
        '240': '0.24s',
        '250': '0.25s',
        '300': '0.3s',
        '400': '0.4s',
        '500': '0.5s',
        '600': '0.6s',
        '800': '0.8s',
        '1000': '1s',
        '1200': '1.2s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.3, 0, 0.2, 1)',
        default: 'ease',
        linear: 'linear'
    },
    container: {
        center: true,
        padding: '16px'
    },
    maxWidth: {
        container: '1266px'
    }
},
  },
};
