import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function Revenue() {
  const [totalRev, setTotalRev] = useState(0);
  const [todayRev, setTodayRev] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRev();
  }, []);

  const fetchRev = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: allRevenue, error: totalError } = await supabase
        .from("revenue")
        .select("total");

      if (totalError) throw totalError;

      const total = allRevenue.reduce((sum, item) => sum + item.total, 0);
      setTotalRev(total);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayRevenue, error: todayError } = await supabase
        .from("revenue")
        .select("total")
        .gte("created_at", today.toISOString());

      if (todayError) throw todayError;

      const todayTotal = todayRevenue.reduce(
        (sum, item) => sum + item.total,
        0
      );
      setTodayRev(todayTotal);
    } catch (err) {
      console.error("Error fetching revenue:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rev row justify-content-center align-items-center text-center gap-2 m-0 py-3">
        <div className="revItem col-lg-3 col-md-5 col-10 py-3 px-1">
          <h3 className="my-0 mx-auto p-2">today's revenue</h3>
          <h2 className="my-2 mx-auto">{todayRev} EGP</h2>
        </div>
        <div className="revItem col-lg-3 col-md-5 col-10 py-3 px-1">
          <h3 className="my-0 mx-auto p-2"> total revenue</h3>
          <h2 className="my-2 mx-auto">{totalRev} EGP</h2>
        </div>
      </div>
    </>
  );
}
