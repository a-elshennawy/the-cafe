import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function Revenue() {
  const [totalRev, setTotalRev] = useState(0);
  const [todayRev, setTodayRev] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRev();

    const channel = supabase
      .channel("revenue_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "revenue",
        },
        (payload) => {
          console.log("Revenue changed:", payload);
          fetchRev(); // Refetch data when changes occur
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
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
      <div className="rev row justify-content-center align-items-center text-center gap-1 m-0 py-3">
        {error && (
          <div className="col-12 alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <div className="col-12 text-center text-white">
            cehcking revenue...
          </div>
        ) : (
          <>
            <div className="revItem col-lg-3 col-md-4 col-sm-4 col-12 py-3 px-1">
              <h1 className="my-0 p-2">today revenue</h1>
              <h2 className="my-2 mx-auto">{todayRev} EGP</h2>
            </div>
            <div className="revItem col-lg-3 col-md-4 col-sm-4 col-12 py-3 px-1">
              <h1 className="my-0 p-2"> total revenue</h1>
              <h2 className="my-2 mx-auto">{totalRev} EGP</h2>
            </div>
          </>
        )}
      </div>
    </>
  );
}
