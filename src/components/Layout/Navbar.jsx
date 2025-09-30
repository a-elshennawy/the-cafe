import { RiShoppingBagFill } from "react-icons/ri";

export default function Navbar() {
  return (
    <>
      <nav className="row justify-content-between align-items-center m-0">
        <div className="col-1 text-start imgSide">
          <img src="/images/logo.png" />
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
