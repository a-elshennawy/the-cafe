import { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import { supabase } from "../../../../lib/supabaseClient";
import { addToCart } from "../../../../utils/CartUtils";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function FoodComp() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const foodSwiperRef = useRef(null);

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

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "food");

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

  useEffect(() => {
    if (products === 0) return;

    if (foodSwiperRef.current) {
      foodSwiperRef.current.destroy(true, true);
    }

    foodSwiperRef.current = new Swiper(".food-swiper", {
      modules: [Autoplay],
      speed: 3500,
      spaceBetween: 30,
      slidesPerView: 2.5,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      loop: products.length > 4,
      loopedSlides: products.length,
      allowTouchMove: true,
      breakpoints: {
        768: {
          slidesPerView: 3.5,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 5.5,
          spaceBetween: 30,
        },
      },
    });

    return () => {
      if (foodSwiperRef.current) {
        foodSwiperRef.current.destroy(true, true);
      }
    };
  }, [products]);
  return (
    <>
      <div className="prodSection row justify-content-start align-items-center gap-1 p-2 m-1">
        <h3 className="m-0 p-0">
          <Link to={"/food"}>
            food corner <MdKeyboardArrowRight />
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
        <div className="swiper food-swiper">
          <div className="swiper-wrapper">
            {products.map((item) => (
              <div key={item.id} className="swiper-slide prodItem">
                <div className="img">
                  <img src={item.image_url} alt="" />
                </div>
                <div className="details p-1">
                  <h6 className="m-0 pb-1">{item.name}</h6>
                  <h6 className="m-0 p-0">{item.price} EGP</h6>
                </div>
                <div className="actions pb-2 px-1">
                  <button onClick={() => handleAddToCart(item.id)}>
                    add to order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
