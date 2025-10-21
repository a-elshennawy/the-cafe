import { useEffect, useState } from "react";
import { FaCircleMinus, FaCirclePlus, FaCreditCard } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getCartItems, removeFromCart, clearCart } from "../../utils/CartUtils";
import { supabase } from "../../lib/supabaseClient";
import { MdCancel } from "react-icons/md";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SKmEyDuPlRq9CpDOwlNlkWLHwONJugGNE2RwM6VtfHAfRjJ7qTDBFTg5hPn81tibzgEjnqzzots6Cy5n94Ak7ND00i0y8w7yp"
);

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // demo product
  const stripe_pay_link = "https://buy.stripe.com/test_fZu9ATg3r5TS5lneoy4AU00";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const itemIds = getCartItems();

    if (itemIds.length === 0) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", itemIds);

    if (error) {
      console.error("Error fetching cart products:", error.message);
    } else {
      const productsWithQuantity = data.map((product) => ({
        ...product,
        quantity: 1,
      }));
      setProducts(productsWithQuantity);
    }
    setLoading(false);
  };

  const handleInc = (id) => {
    setProducts(
      products.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDec = (id) => {
    setProducts(
      products.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleDel = (id) => {
    removeFromCart(id);
    setProducts(products.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (products.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);
    setError(null);

    // format items as JSON
    const items = products.map((item) => ({
      name: item.name,
      amount: item.quantity,
    }));

    const total = calculateTotal();

    // insert order (supabase)
    const { data, error } = await supabase.from("orders").insert([
      {
        customerName: customerName.trim(),
        items: items,
        total: total,
      },
    ]);

    if (error) {
      console.error("Error creating order:", error.message);
      setError("Failed to create order. Please try again.");
      setSubmitting(false);
    } else {
      clearCart();
      setProducts([]);
      setCustomerName("");
      alert("Order placed successfully!");
      setSubmitting(false);
    }
  };

  const handelCardCheckout = async () => {
    window.location.href = stripe_pay_link;
  };

  return (
    <>
      <div className="row justify-content-center align-items-center p-2 m-1 gap-2">
        <div className="col-12 p-0">
          <button className="homeBtn text-start">
            <Link to={"/"}>Home</Link>
          </button>
        </div>
        <form
          className="cartForm col-lg-4 col-md-6 col-12"
          onSubmit={handleCheckout}
        >
          <input
            type="text"
            placeholder="your name is ?"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          {error && (
            <div className="alert alert-danger mt-2" role="alert">
              {error}
            </div>
          )}

          <div className="orderedItems py-2 px-0">
            {loading ? (
              <p className="text-center py-2 m-0">Loading cart...</p>
            ) : products.length === 0 ? (
              <p className="text-center py-2 m-0">Your cart is empty</p>
            ) : (
              products.map((item) => (
                <div key={item.id}>
                  <div className="item row justify-content-start align-items-center m-0 px-0 py-2">
                    <h6 className="col-4 m-0 p-0">{item.name}</h6>
                    <div className="col-3 p-0">
                      <button type="button" onClick={() => handleDec(item.id)}>
                        <FaCircleMinus />
                      </button>
                      <h6 className="m-0 px-2 py-0 d-inline">
                        {item.quantity}
                      </h6>
                      <button type="button" onClick={() => handleInc(item.id)}>
                        <FaCirclePlus />
                      </button>
                    </div>
                    <div className="col-3 p-0">
                      <h6 className="m-0 p-0">
                        {item.price * item.quantity} EGP
                      </h6>
                    </div>
                    <div className="col-2 text-end p-0">
                      <button type="button" onClick={() => handleDel(item.id)}>
                        <MdCancel />
                      </button>
                    </div>
                  </div>
                  <hr className="m-0" />
                </div>
              ))
            )}
          </div>
          <button
            className="me-2"
            type="submit"
            disabled={submitting || products.length === 0}
          >
            {submitting
              ? "Processing..."
              : `pay cash (${calculateTotal()} EGP)`}
          </button>
          <button
            type="button"
            className="cardPay"
            onClick={handelCardCheckout}
          >
            pay by card
            <span className="ms-1">
              <FaCreditCard />
            </span>
          </button>
        </form>
      </div>
    </>
  );
}
