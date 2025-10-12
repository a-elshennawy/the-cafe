import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../LoadingSpinner";

export default function HotDrinks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "hot drinks");

    if (error) {
      console.error("error fetching products:", error.message);
      setError(error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };
  return (
    <>
      <div className="row justify-content-center align-items-center p-2 m-1 gap-2">
        <div className="col-12">
          <button className="homeBtn text-start">
            <Link to={"/"}>Home</Link>
          </button>
        </div>
        {loading && (
          <div className="col-12">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="col-12">
            <p>{error}</p>
          </div>
        )}
        {products.map((item) => (
          <div
            className="prodCardDetails p-0 col-lg-2 col-md-3 col-11"
            key={item.id}
          >
            <div className="img">
              <img src={item.image_url} alt={item.name} />
            </div>
            <div className="details p-1">
              <h4 className="m-0 pb-1">{item.name}</h4>
              <p className="m-0 pb-1">{item.desc}</p>
              <h5 className="m-0 p-0">{item.price} EGP</h5>
            </div>
            <div className="actions pb-2 px-1">
              <button>add to order</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
