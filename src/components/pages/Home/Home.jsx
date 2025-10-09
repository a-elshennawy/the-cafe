import ColdDrinksComp from "./HomeSections/Products/ColdDrinksComp";
import HotDrinksComp from "./HomeSections/Products/HotDrinksComp";
import FoodComp from "./HomeSections/Products/FoodComp";
import FeedbackInput from "./HomeSections/Feedback/FeedbackInput";

export default function Home() {
  return (
    <>
      <section className="container-fluid text-start">
        <ColdDrinksComp />
        <hr />
        <HotDrinksComp />
        <hr />
        <FoodComp />
        <hr />
        <FeedbackInput />
      </section>
    </>
  );
}
