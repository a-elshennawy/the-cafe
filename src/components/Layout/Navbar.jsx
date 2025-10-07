import { RiShoppingBagFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="row justify-content-between align-items-center m-2">
        <div className="col-lg-1 col-4 text-start imgSide">
          <Link to={"/"}>
            <img src="/images/logo.png" />
          </Link>
        </div>
        <div className="col-4 text-end btnsSide">
          <button className="toCart">
            <RiShoppingBagFill />
          </button>
        </div>
      </nav>
    </>
  );
}
