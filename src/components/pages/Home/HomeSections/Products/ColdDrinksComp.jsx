import { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import { supabase } from "../../../../lib/supabaseClient";

export default function ColdDrinksComp() {
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
      .eq("category", "cold drinks");

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
      <div className="prodSection row justify-content-start align-items-center gap-1 p-2 m-1">
        <h3 className="m-0 p-0">
          <Link to={"/cold-drinks"}>
            cold drinks <MdKeyboardArrowRight />
          </Link>
        </h3>
        {error && (
          <div className="alert alert-danger text-white p-2 my-2" role="alert">
            {error}
          </div>
        )}
        {loading && (
          <p className="text-center text-white">Loading products...</p>
        )}
        {!loading && products.length === 0 && (
          <p className="text-center text-white">No products available.</p>
        )}
        <div className="products-scroll-container px-0">
          {products.map((item) => (
            <div key={item.id} className="prodItem">
              <div className="img">
                <img src={item.image_url} alt={item.name} />
              </div>
              <div className="details p-1">
                <h4 className="m-0 pb-1">{item.name}</h4>
                <h5 className="m-0 p-0">{item.price} EGP</h5>
              </div>
              <div className="actions pb-2 px-1">
                <button>order</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
