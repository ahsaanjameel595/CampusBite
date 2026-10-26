# CampusBite

CampusBite is a frontend-only campus canteen ordering app built for a student assignment. Students can browse a locally stored menu, save favourites, build a cart, and place a simulated pickup order. No account, backend, database, payment details, API key, or paid service is required.

## Features

- Search food names, categories, and descriptions; combine search with category and campus-favourite filters.
- Open item details with ingredients, rating, availability, prep time, and quantity controls.
- Add, remove, and update cart items. The header count and PKR total stay in sync.
- Save and remove favourites, with a dedicated favourites page.
- Validate pickup details and display a simulated order confirmation.
- Persist cart and favourite IDs in LocalStorage.
- Responsive menu, cart, item details, and checkout pages, using the food photos supplied for this project.

## Technology

React, Vite, JavaScript, React Router, Context API, React Hooks, CSS Grid/Flexbox, local JSON and Fetch API, LocalStorage, Lucide React, Vitest, and React Testing Library.

## Run locally

Install Node.js (Node 20.19+ or 22.12+ is recommended for the installed Vite version), then run from this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Build and test

```bash
npm run build
npm run preview
npm run test
npm run test:run
npm run lint
```

`npm run test` starts Vitest in watch mode. `npm run test:run` runs once and exits. `npm run preview` serves the most recent production build.

## Project map

```text
public/
  data/menu.json          Source of all food item data
  images/                 Local category artwork used by menu items
src/
  components/              Shared UI, layout, menu, cart, and checkout
  context/                 Cart, favourite, and toast shared state
  hooks/                   Menu loading and LocalStorage persistence
  pages/                   Menu, details, favourites, cart, checkout, 404
  services/menuService.js  Fetches and validates the local menu
  styles/                  Design tokens, layout, components, responsive CSS
  utils/                   PKR price formatting
 tests/                    Application-flow and menu-service tests
```

## How shared state works

`CartProvider` owns the shared cart. It exposes cart actions and derives item count and total from cart rows, so pages do not maintain separate copies of cart state. `FavoritesProvider` shares saved item IDs. `ToastProvider` shows short feedback messages after actions.

The `useLocalStorage` hook safely reads and writes JSON. Cart rows are saved under `campusbite-cart`; favourite IDs are saved under `campusbite-favorites`. Invalid JSON or unavailable browser storage falls back safely. The full menu is never stored in LocalStorage.

## Menu data

`public/data/menu.json` is the source of the 21 sample food items. `fetchMenu()` loads it from `/data/menu.json` and validates the response. `fetchMenuItemById()` returns a matching item or `null` for an unknown ID. The `useMenu` hook exposes loading, error, and retry states.

To add a dish, add an object with a unique string `id`, `name`, `description`, `category`, numeric PKR `price`, local `image` path, numeric `rating`, numeric `preparationTime`, boolean `available`, boolean `isPopular`, and an `ingredients` array. Use one of the supplied photos in `public/images/`, or add a local photo there and reference it as `/images/your-image.jpg` (PNG and WebP also work). Keep the category in the menu filter list in `src/pages/MenuPage.jsx` if it is a new category.

## Simulated checkout

Checkout collects a student name, student ID, campus pickup point, and contact number. It does not collect or process payment information. Submitting a valid form creates a display-only order number, shows the order summary, and clears the cart. The confirmation is not sent to a canteen or stored on a server.
