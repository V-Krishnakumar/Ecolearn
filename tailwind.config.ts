import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-nature': 'var(--gradient-nature)',
				'gradient-earth': 'var(--gradient-earth)',
				'gradient-ocean': 'var(--gradient-ocean)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(-8px)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'bounce-playful': {
					'0%, 100%': {
						transform: 'translateY(0) scale(1)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(-12px) scale(1.1)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'scale-pulse': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.08)'
					}
				},
				'scale-bounce': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'25%': {
						transform: 'scale(1.1)'
					},
					'75%': {
						transform: 'scale(0.95)'
					}
				},
				'slide-up': {
					from: {
						transform: 'translateY(30px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'wiggle': {
					'0%, 100%': {
						transform: 'rotate(0deg)'
					},
					'25%': {
						transform: 'rotate(3deg)'
					},
					'75%': {
						transform: 'rotate(-3deg)'
					}
				},
				'rainbow-shift': {
					'0%': {
						filter: 'hue-rotate(0deg)'
					},
					'100%': {
						filter: 'hue-rotate(360deg)'
					}
				},
				'float-cloud': {
					'0%, 100%': {
						transform: 'translateX(0) translateY(0)'
					},
					'33%': {
						transform: 'translateX(10px) translateY(-5px)'
					},
					'66%': {
						transform: 'translateX(-5px) translateY(5px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'bounce-playful': 'bounce-playful 1.5s infinite',
				'scale-pulse': 'scale-pulse 2s infinite',
				'scale-bounce': 'scale-bounce 1s infinite',
				'slide-up': 'slide-up 0.4s ease-out',
				'wiggle': 'wiggle 0.5s ease-in-out',
				'rainbow-shift': 'rainbow-shift 3s linear infinite',
				'float-cloud': 'float-cloud 6s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
