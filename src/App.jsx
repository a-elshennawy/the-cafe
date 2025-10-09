import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Layout from "./components/Layout/Layout";

const Admin = lazy(() => import("./components/pages/Admin/Admin"));
const Home = lazy(() => import("./components/pages/Home/Home"));
const StaffLogin = lazy(() => import("./components/pages/Login/StaffLogin"));

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="" element={<Home />} />
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
