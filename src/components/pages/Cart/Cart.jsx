import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
export default function Cart() {
  return (
    <>
      <div className="row justify-content-center align-items-center p-2 m-1 gap-2">
        <div className="col-12">
          <button className="homeBtn text-start">
            <Link to={"/"}>Home</Link>
          </button>
        </div>
        <form className="cardForm col-lg-4 col-md-6 col-12">
          <input type="text" placeholder="your name is ?" />
          <div className="orderedItems py-2 px-0">
            <div className="item row justify-content-start align-items-center m-0 px-0 py-2">
              <h4 className="col-3 m-0 p-0">tea</h4>
              <div className="col-4 count text-start p-0">
                <button>
                  <FaCircleMinus />
                </button>
                <h6 className="m-0 px-2 py-0">3</h6>
                <button>
                  <FaCirclePlus />
                </button>
              </div>
              <div className="col-4 price p-0">
                <h6 className="m-0 px-2 py-0">item price EGP</h6>
              </div>
            </div>
            <hr />
          </div>
          <button type="submit">checkeout (total price EGP)</button>
        </form>
      </div>
    </>
  );
}
