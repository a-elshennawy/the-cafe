import { useState, useEffect } from "react";

export default function HotDrinksComp() {
  const [peoducts, setProducts] = useState([]);
  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((json) => {
        const hotDrinks = json.menu
          .filter((item) => item.category === "hot drinks")
          .slice(0, 4);
        setProducts(hotDrinks);
      });
  }, []);
  return (
    <>
      <div className="prodSection row justify-content-start align-items-center gap-3 py-3 px-0 m-0">
        {peoducts.map((item) => (
          <div className="prodItem p-0 col-lg-2 col-10">
            <div className="img">
              <img src="/public/images/StockImages/Coffee.png" alt="" />
            </div>
            <div className="details p-2">
              <h4 className="m-0 pb-1">{item.name}</h4>
              <h5 className="m-0 p-0">{item.price} EGP</h5>
            </div>
            <div className="actions pb-2 px-2">
              <button>add to order</button>
            </div>
          </div>
        ))}
      </div>
      <hr />
    </>
  );
}
