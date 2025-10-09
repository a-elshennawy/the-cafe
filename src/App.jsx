import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Layout from "./components/Layout/Layout";

const Admin = lazy(() => import("./components/pages/Admin/Admin"));
const Home = lazy(() => import("./components/pages/Home/Home"));
const StaffLogin = lazy(() => import("./components/pages/Login/StaffLogin"));
const Food = lazy(() => import("./components/pages/Food/Food"));
const ColdDrinks = lazy(() =>
  import("./components/pages/ColdDrinks/ColdDrinks")
);
const HotDrinks = lazy(() => import("./components/pages/HotDrinks/HotDrinks"));

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="" element={<Home />} />
              <Route path="food" element={<Food />} />
              <Route path="cold-drinks" element={<ColdDrinks />} />
              <Route path="hot-drinks" element={<HotDrinks />} />
            </Route>
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
