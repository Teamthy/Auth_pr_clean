# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Tailwind CSS

This project is already configured to use Tailwind CSS. Styles are imported from `src/index.css` which contains the
`@tailwind base;
@tailwind components;
@tailwind utilities;`

Configuration files `tailwind.config.js` and `postcss.config.js` live at the project root. The `content` paths include
all JSX/TSX files under `src` so that Tailwind can purge unused styles in production. To rebuild just the CSS you can
run `npm run build:css`, but the regular `dev` and `build` scripts handle it automatically via Vite and PostCSS.

Authentication screens share a common wrapper (`src/AuthPageWrapper.jsx`) that provides the two‑column layout with a
decorative image on the left. Feel free to adjust the image URLs or reuse the component for other pages if you like.

Continue with normal development, using utility classes throughout your components.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
