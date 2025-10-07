import SearchComp from "./HomeSections/SearchComp";
import ColdDrinksComp from "./HomeSections/ColdDrinksComp";
import HotDrinksComp from "./HomeSections/HotDrinksComp";
import FoodComp from "./HomeSections/FoodComp";

export default function Home() {
  return (
    <>
      <section className="container-fluid text-start">
        <SearchComp />
        <ColdDrinksComp />
        <HotDrinksComp />
        <FoodComp />
      </section>
    </>
  );
}
