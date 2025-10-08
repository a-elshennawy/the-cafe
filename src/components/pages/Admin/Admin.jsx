import InvSection from "./AdminSections/InvSection";
import OrdersSection from "./AdminSections/OrdersSection";
import { useState, useEffect } from "react";

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("orders");

  return (
    <>
      <section className="container-fluid row justify-content-center align-items-center m-0 gap-1">
        <div className="navTabs col-12 text-center p-0 my-2">
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
        </div>

        {selectedTab === "inventory" && <InvSection />}
        {selectedTab === "orders" && <OrdersSection />}
      </section>
    </>
  );
}
