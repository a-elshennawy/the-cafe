# The Cafe ☕

A modern, responsive cafe ordering system built with React and Supabase. Features real-time product updates, dynamic cart management, and an intuitive user interface for browsing food and beverages.

## 🚀 Features

- **Real-time Product Management**: Leverages Supabase real-time subscriptions to instantly reflect product changes
- **Dynamic Cart System**: Custom cart utility with event-driven updates across components
- **Live Search**: Filter products across categories with instant results
- **Responsive Design**: Mobile-first approach with Bootstrap grid system
- **Interactive Carousels**: Swiper.js integration for smooth product browsing with responsive breakpoints
- **Category Navigation**: Organized product sections (Food, Hot Drinks, Cold Drinks)
- **Real-time Cart Counter**: Live updates in the navbar as items are added

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library with hooks
- **React Router DOM** - Client-side routing
- **Bootstrap 5** - Responsive grid and components
- **Swiper.js** - Touch-enabled carousel slider
- **React Icons** - Icon library (Material Design & Remix Icon)

### Backend & Database

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)

### Development Tools

- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/a-elshennawy/the-cafe.git
cd the-cafe
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Supabase**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**

Create a `products` table in your Supabase project:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  desc TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create an index on category for faster queries
CREATE INDEX idx_products_category ON products(category);
```

5. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
the-cafe/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation with cart counter
│   │   └── home/
│   │       ├── ColdDrinksComp.jsx  # Cold drinks section
│   │       ├── HotDrinksComp.jsx   # Hot drinks section
│   │       └── FoodComp.jsx        # Food section
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   ├── Food.jsx                # Food products page
│   │   ├── HotDrinks.jsx           # Hot drinks page
│   │   ├── ColdDrinks.jsx          # Cold drinks page
│   │   └── Cart.jsx                # Shopping cart
│   ├── utils/
│   │   └── CartUtils.js            # Cart management utilities
│   ├── lib/
│   │   └── supabaseClient.js       # Supabase configuration
│   ├── App.jsx                     # Main app component
│   └── main.jsx                    # Entry point
├── public/
│   └── images/                     # Static assets
├── .env                            # Environment variables
└── package.json
```

## 🔧 Key Components

### Cart Management System

The cart uses browser events for cross-component communication:

```javascript
// Add item to cart
addToCart(productId);

// Get cart count
const count = getCartCount();

// Listen for cart updates
window.addEventListener("cartUpdated", handleCartUpdate);
```

### Real-time Product Updates

Components automatically refresh when products change in the database:

```javascript
const channel = supabase
  .channel("products_changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "products",
    },
    fetchProducts
  )
  .subscribe();
```

### Responsive Swiper Configuration

Carousels adapt to different screen sizes:

```javascript
breakpoints: {
  768: { slidesPerView: 3 },    // Tablets
  1024: { slidesPerView: 4 }    // Desktop
}
```

### Live Search

Search functionality filters products in real-time across all category pages:

```javascript
window.dispatchEvent(new CustomEvent("searchChanged", { detail: searchTerm }));
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (2.5 slides per view)
- **Tablet**: 768px - 1023px (3.5 slides per view)
- **Desktop**: ≥ 1024px (5.5 slides per view)

## 🗃️ Database Schema

### Products Table

| Column     | Type      | Description                            |
| ---------- | --------- | -------------------------------------- |
| id         | UUID      | Primary key                            |
| name       | TEXT      | Product name                           |
| desc       | TEXT      | Product description                    |
| price      | DECIMAL   | Product price in EGP                   |
| category   | TEXT      | Category (food/hot drinks/cold drinks) |
| image_url  | TEXT      | Product image URL                      |
| created_at | TIMESTAMP | Creation timestamp                     |

## 🎨 Styling

The project uses Bootstrap 5 for layout with custom CSS for:

- Product cards
- Navigation styling
- Cart button with counter badge
- Category sections
- Loading states

## 🚦 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Environment Variables

| Variable                 | Description                 |
| ------------------------ | --------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL   |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Ahmed Elshennawy**

- GitHub: [@a-elshennawy](https://github.com/a-elshennawy)
- Portfolio: [(https://ahmed-elshennawy.vercel.app/)]

---

Built with ☕ and React
