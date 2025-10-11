import InvSection from "./AdminSections/InvSection";
import OrdersSection from "./AdminSections/OrdersSection";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import LoadingSpinner from "../../LoadingSpinner";
import FeedbackSection from "./AdminSections/FeedbackSection";

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("orders");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/staff-login");
      } else {
        setUser(session.user);
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/staff-login");
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="container-fluid row justify-content-center align-items-center m-0 gap-1">
        <div className="navTabs col-12 text-center">
          <button
            onClick={() => setSelectedTab("orders")}
            className={selectedTab === "orders" ? "selected" : ""}
          >
            orders
          </button>
          <button
            onClick={() => setSelectedTab("inventory")}
            className={selectedTab === "inventory" ? "selected" : ""}
          >
            inventory
          </button>
          <button
            onClick={() => setSelectedTab("feedback")}
            className={selectedTab === "feedback" ? "selected" : ""}
          >
            feedback
          </button>
        </div>

        {selectedTab === "inventory" && <InvSection />}
        {selectedTab === "orders" && <OrdersSection />}
        {selectedTab === "feedback" && <FeedbackSection />}
      </section>
    </>
  );
}
