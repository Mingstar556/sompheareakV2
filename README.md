# 🧸 Somphea Reak V2 (សម្ភារៈ) • D2C Toy Wonderland & Collectibles Studio

> A playful, interactive, and flashy D2C storefront redesign for **Somphea Reak Studio** (សម្ភារៈ), engineered specifically to captivate kids, parents, and collectible toy enthusiasts in Cambodia and beyond.

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-0.173.0-blueviolet?style=for-the-badge&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-orange?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-f43f5e?style=for-the-badge&logo=framer)

---

## ✨ Highlights & Key Features

### 🕹️ 1. Interactive Three.js 3D Toy Stage & 360° Inspector
- **Dynamic 3D Hero Stage**: Features a posable 3D robot toy, orbiting gold star collectible, floating mystery box, and sparkling particle galaxy that tilts with cursor movement.
- **360° Interactive Toy Inspector**: Allows kids to spin toys in full 3D, customize shell colors (Neon Violet, Bubblegum Pink, Cyan Spark, Emerald Mint, Sunburst Gold), and toggle holographic wireframe mode.

### 📜 2. Silky Smooth Lenis Inertia Scrolling
- Buttery smooth inertia scroll powered by **Lenis** (`lenis`), integrated with **Framer Motion** scroll-linked parallax, bouncy entrance triggers, and dynamic marquee banner.

### 🔗 3. Italian Modular Charm Bracelet Studio
- Signature Somphea Reak feature upgraded to an interactive visual link track.
- Choose band finish: **Silver Inox 316L**, **18K Royal Gold**, **Rose Gold**, or **Obsidian Black**.
- Choose wrist size (16, 17, 18 links), snap on emblems, anime badges, lucky stars, and cute characters.
- Live price calculation, packaging choice (Basic vs. Luxury Velvet Box), and auto-generated Italian Style ID.

### 🎰 4. Lucky Mystery Blind Box Machine
- Tap-to-unbox interactive capsule mini-game with anticipation shaking, sound effects, confetti bursts, and collectible rarity reveal (Common, Rare, Super Rare, Legendary).

### 🇰🇭 5. Cambodian Localized D2C Checkout & Direct Telegram Orders
- Dual currency switcher: **USD ($)** & **Khmer Riel (៛)** with live 4,100 exchange rate.
- Bilingual interface: **English** & **Khmer (ភាសាខ្មែរ)**.
- 1-Click order receipt generator forwarding directly to `@sompheareak` on Telegram.
- Delivery options for Phnom Penh & all 24 provinces with **Cash on Delivery (COD)** and **ABA KHQR Scan to Pay**.

### 🎵 6. Tactile Toy Web Audio Sound Synthesizer
- Built-in zero-dependency Web Audio API synthesizer for playful pops, chimes, fanfares, and charm snaps with sound toggle.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Smooth Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Physics & Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + CSS Modules (`ToyEffects.module.css`)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.17` or higher (recommended: Node 20+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mingstar556/sompheareakV2.git
cd sompheareakV2

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
sompheareakV2/
├── public/
│   └── assets/            # Logos, charms, icons, and media
├── src/
│   ├── app/
│   │   ├── globals.css    # Typography, dark/light vars, animations
│   │   ├── layout.tsx     # Root layout with SEO and Providers
│   │   └── page.tsx       # Main Storefront Layout
│   ├── components/
│   │   ├── AnnouncementBar.tsx      # Ticker & exchange rate
│   │   ├── Navbar.tsx               # Header with currency, lang, sounds, cart
│   │   ├── HeroSection.tsx          # Hero with Three.js 3D canvas
│   │   ├── ThreeHeroCanvas.tsx      # Three.js 3D robot, star, particles
│   │   ├── ThreeToyViewer.tsx       # 360 3D toy inspector modal
│   │   ├── CategoryArcade.tsx       # Chunky category chips
│   │   ├── ProductCard.tsx          # 3D lift product card
│   │   ├── ProductGrid.tsx          # Catalog with search and sorting
│   │   ├── MysteryBlindBox.tsx      # Interactive unboxing capsule
│   │   ├── CustomBraceletStudio.tsx # DIY Italian charm builder
│   │   ├── CartDrawer.tsx           # Cart with free shipping meter
│   │   ├── CheckoutModal.tsx        # Telegram order generator
│   │   ├── RewardsModal.tsx         # VIP Toy Club points system
│   │   ├── SmoothScrollProvider.tsx # Lenis smooth scroll
│   │   └── Footer.tsx               # Store information and credits
│   ├── context/
│   │   └── StoreContext.tsx         # Global state & translations
│   ├── data/
│   │   ├── categories.ts            # Category definitions
│   │   ├── products.ts              # Rich toy catalog
│   │   ├── charms.ts                # Italian modular charms
│   │   └── translations.ts          # English & Khmer strings
│   ├── styles/
│   │   └── ToyEffects.module.css    # CSS Modules animations
│   ├── types/
│   │   └── store.ts                 # TypeScript interfaces
│   └── utils/
│       ├── audio.ts                 # Web Audio API sound FX
│       ├── currency.ts              # USD/KHR conversion
│       └── telegram.ts              # Telegram receipt formatter
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📜 License & Credits

Created for **Somphea Reak Studio (សម្ភារៈ)**. All trademarks and brand assets belong to their respective creators.
