import { RiShoppingBagFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { getCartCount } from "../utils/CartUtils";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Initial count
    setCartCount(getCartCount());

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <>
      <nav className="row justify-content-start align-items-center m-2">
        <div className="col-lg-1 col-md-2 col-4 text-start imgSide">
          <Link to={"/"}>
            <img src="/images/logo.png" />
          </Link>
        </div>
        {location.pathname === "/food" ||
        location.pathname === "/cold-drinks" ||
        location.pathname === "/hot-drinks" ? (
          <input
            className="col-lg-2 col-md-3 col-4"
            type="search"
            placeholder="search..."
          />
        ) : null}
        <div
          className={
            location.pathname === "/food" ||
            location.pathname === "/cold-drinks" ||
            location.pathname === "/hot-drinks"
              ? "col-lg-9 col-md-7 col-4 text-end btnsSide"
              : "col-lg-11 col-md-9 col-8 text-end btnsSide"
          }
        >
          <button className="toCart">
            <Link to={"/cart"}>
              <span className="cartCount">{cartCount}</span>
              <RiShoppingBagFill />
            </Link>
          </button>
        </div>
      </nav>
    </>
  );
}
