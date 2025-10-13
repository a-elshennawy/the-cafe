import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../LoadingSpinner";
import { addToCart } from "../../utils/CartUtils";
import { motion } from "motion/react";

export default function ColdDrinks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel("products_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("products changed:", payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleSearchChange = (e) => {
      setSearchTerm(e.detail);
    };

    window.addEventListener("searchChanged", handleSearchChange);
    return () =>
      window.removeEventListener("searchChanged", handleSearchChange);
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

  const handleAddToCart = (id) => {
    const wasAdded = addToCart(id);
    if (wasAdded) {
      console.log("Item added to cart");
    } else {
      console.log("Item already in cart");
    }
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="row justify-content-start align-items-center p-2 m-1 gap-2">
        <div className="col-12 p-0">
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
        {filteredProducts.map((item) => (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="prodCardDetails p-0 col-lg-2 col-md-3 col-9"
            key={item.id}
          >
            <div className="img">
              <img src={item.image_url} alt={item.name} />
            </div>
            <div className="details p-2">
              <h4 className="m-0 pb-1">{item.name}</h4>
              <p className="m-0 pb-1">{item.desc}</p>
              <h5 className="m-0 p-0">{item.price} EGP</h5>
            </div>
            <div className="actions pb-2 px-1">
              <button onClick={() => handleAddToCart(item.id)}>
                add to order
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
