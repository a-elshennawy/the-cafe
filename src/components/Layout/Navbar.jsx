import { RiShoppingBagFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="row justify-content-start align-items-center m-2">
        <div className="col-lg-1 col-md-2 col-4 text-start imgSide">
          <Link to={"/"}>
            <img src="/images/logo.png" />
          </Link>
        </div>
        <input
          className="col-lg-2 col-md-3 col-4"
          type="search"
          placeholder="search..."
        />
        <div className="col-lg-9 col-md-7 col-4 text-end btnsSide">
          <button className="toCart">
            <RiShoppingBagFill />
          </button>
        </div>
      </nav>
    </>
  );
}
