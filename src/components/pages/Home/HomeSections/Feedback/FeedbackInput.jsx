import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function FeedbackInput() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const swiperRef = useRef(null);

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

  useEffect(() => {
    if (feedback.length === 0) return;

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
    }

    // Initialize Swiper after the component mounts
    swiperRef.current = new Swiper(".swiper", {
      modules: [Autoplay],
      speed: 3000,
      spaceBetween: 30,
      slidesPerView: 2,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      loop: true,
      loopedSlides: feedback.length,
      allowTouchMove: true,
    });

    // Cleanup
    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, [feedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSendingFeedback(true);

    try {
      if (!customerName.trim()) {
        setError("feedback have to have a customer name");
        setSendingFeedback(false);
        return;
      }
      if (!feedbackText.trim()) {
        setError("feedback have to have a text");
        setSendingFeedback(false);
        return;
      }

      const { data, error } = await supabase
        .from("feedback")
        .insert([
          {
            customerName: customerName.trim(),
            feedbackText: feedbackText.trim(),
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      setSuccess("thanks for your feedback :)");

      setCustomerName("");
      setFeedbackText("");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding feedback:", err);
      setError(err.message || "Failed to send feedback");
    } finally {
      setSendingFeedback(false);
    }
  };

  return (
    <>
      <div className="feedbackSection row justify-content-start align-items-center m-0 p-2 gap-1">
        <form
          onSubmit={handleSubmit}
          className="feedbackForm col-lg-4 col-12 row justify-content-start align-items-center m-0 p-2 gap-1"
        >
          <input
            type="text"
            placeholder="your name..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <textarea
            cols={10}
            rows={5}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          >
            your feedback...
          </textarea>
          <button type="submit" disabled={sendingFeedback}>
            {sendingFeedback ? "sending..." : "send"}
          </button>

          {error && (
            <div className="alert alert-danger p-2 my-2" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success p-2 my-2" role="alert">
              {success}
            </div>
          )}
        </form>
        <div className="customerFeedBacks col-lg-5 col-12">
          <div className="swiper">
            <div className="swiper-wrapper">
              {feedback.map((item) => (
                <div
                  className="swiper-slide feedbackItem text-start"
                  key={item.id}
                >
                  <h4 className="mt-0 mb-2">{item.customerName}</h4>
                  <h5 className="m-0">{item.feedbackText}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
