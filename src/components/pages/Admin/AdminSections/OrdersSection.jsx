import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("orders changed:", payload);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("error fetching orders:", error.message);
      setError(error.message);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  const habdleConfirm = async (id) => {
    if (!window.confirm("Are you sure this order is done ?")) {
      return;
    }

    setError(null);
    setSuccess(null);
    setConfirming(true);

    try {
      // get order details
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select()
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // insert in revenue
      const { errr: insertError } = await supabase.from("revenue").insert([
        {
          order_id: id,
          total: order.total,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      // delete it from orders
      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setSuccess("Order confirmed and moved to revenue successfully");

      // Refresh the feedback list
      fetchOrders();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error confirming order:", err);
      setError(err.message || "Failed to confirm order");
    } finally {
      setConfirming(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this order ?")) {
      return;
    }

    setError(null);
    setSuccess(null);
    setConfirming(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      setSuccess("order delted successfully");

      // Refresh the feedback list
      fetchOrders();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleteing order:", err);
      setError(err.message || "Failed to delete order");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <div className="OrdersSection py-3 px-1 row justify-content-center align-items-center m-0 gap-1">
        {error && (
          <div
            className="alert alert-danger p-2 my-2 col-lg-3 col-md-5 col-12"
            role="alert"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="alert alert-success p-2 my-2 col-lg-3 col-md-5 col-12"
            role="alert"
          >
            {success}
          </div>
        )}
        {orders.map((item) => (
          <div key={item.id} className="orderItem p-3 col-lg-2 col-10">
            <h4 className="pb-2">{item.customerName}</h4>
            <div className="pb-1">
              {item.items.map((product, index) => (
                <h6 key={index} className="my-2 p-0">
                  {product.amount}x {product.name}
                </h6>
              ))}
              <h5 className="my-2">total : {item.total} EGP</h5>
            </div>
            <div>
              <button onClick={() => habdleConfirm(item.id)}>
                {confirming ? "confirming..." : "confirm order"}
              </button>
              <button
                className="deletBtn"
                onClick={() => handleDelete(item.id)}
              >
                delete order
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
