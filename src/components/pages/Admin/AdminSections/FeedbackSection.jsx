import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFeedback();

    const channel = supabase
      .channel("feedback_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feedback",
        },
        (payload) => {
          console.log("feedback changed:", payload);
          fetchFeedback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("error fetching feedback:", error.message);
      setError(error.message);
    } else {
      setFeedback(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback ?")) {
      return;
    }

    setError(null);
    setSuccess(null);
    setDeleting(true);

    try {
      const { data, error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      setSuccess("feedback deleted successfully");

      // Refresh the feedback list
      fetchFeedback();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      <div className="feddbackdashbord py-3 px-0 col-12 row justify-content-start align-items-center m-0 gap-2">
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
        {feedback.map((item) => (
          <div key={item.id} className="feedbackCard col-lg-3 col-md-5 col-12">
            <h4 className="mt-0 mb-2">{item.customerName}</h4>
            <h5 className="m-0">{item.feedbackText}</h5>
            <button
              className="mt-3 float-end"
              onClick={() => handleDelete(item.id)}
              disabled={deleting}
            >
              delete feedback
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
