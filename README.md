# Grid

A 3D city where every GitHub developer gets a building. The height of your building is determined by your public repository count. Walk through the city, explore other developers' profiles, and find your place in the Grid.

## What is Grid?

Grid is an interactive 3D world built with React Three Fiber. Every registered user gets a building in the city — the more public repos you have on GitHub, the taller your building. Walk around, look at other developers' buildings, and click on them to see their profile details.

## Features

- Dynamic city generation — buildings scale with GitHub repo count
- First-person exploration — walk through the city with WASD or mobile joystick
- Developer profiles — click any building to see GitHub stats, bio, and social links
- Night atmosphere — stars, city lights, and point lights near street corners
- Mobile support — dual joystick controls for movement and camera
- NPC — a roaming character that reacts to collisions
- Billboard ads — custom ad boards at street intersections
- Physics — powered by Rapier for realistic collisions

## Tech Stack

- React Three Fiber — 3D rendering
- @react-three/rapier — physics engine
- @react-three/drei — helpers (Sky, Stars, useGLTF, useAnimations)
- Supabase — auth and user profiles database
- GitHub API — fetching repo counts and profile data
- nipplejs — mobile joystick controls
- Vite — build tool
- TailwindCSS — UI styling
- Vercel — deployment

## Getting Started

### Prerequisites
- Node.js 16+
- A Supabase project
- A GitHub personal access token

### Installation

```bash
git clone https://github.com/cynicalmindset/Grid.git
cd Grid
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GITHUB_TOKEN=your_github_token
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Live Demo

[grid-six-swart.vercel.app](https://grid-six-swart.vercel.app)
