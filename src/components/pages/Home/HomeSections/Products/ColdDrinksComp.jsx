import { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ColdDrinksComp() {
  const [peoducts, setProducts] = useState([]);
  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((json) => {
        const coldDrinks = json.menu
          .filter((item) => item.category === "cold drinks")
          .slice(0, 4);
        setProducts(coldDrinks);
      });
  }, []);

  return (
    <>
      <div className="prodSection row justify-content-start align-items-center gap-3 p-2 m-2">
        <h3 className="m-0 p-0">
          <Link to={"/cold-drinks"}>
            cold drinks <MdKeyboardArrowRight />
          </Link>
        </h3>
        {peoducts.map((item) => (
          <div className="prodItem p-0 col-lg-2 col-md-3 col-5">
            <div className="img">
              <img src="/public/images/StockImages/Coffee.png" alt="" />
            </div>
            <div className="details p-2">
              <h4 className="m-0 pb-1">{item.name}</h4>
              <h5 className="m-0 p-0">{item.price} EGP</h5>
            </div>
            <div className="actions pb-2 px-2">
              <button>order</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
