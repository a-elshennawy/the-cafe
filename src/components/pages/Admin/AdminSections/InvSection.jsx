export default function InvSection() {
  return (
    <>
      <div className="InvSection py-3 px-0 col-12 row justify-content-center align-items-start m-0 gap-2">
        <div className="searchContainer col-12 text-center py-2">
          <input
            className="prodSearch mb-2 mx-1"
            type="search"
            placeholder="search product name..."
          />
          <button>search</button>
        </div>
        <form className="crudForm p-2 col-lg-4 col-12">
          <div className="inputContainer p-0 my-2">
            <input type="text" placeholder="product name" />
          </div>
          <div className="inputContainer p-0 my-2">
            <input type="text" placeholder="product description" />
          </div>
          <div className="inputContainer p-0 my-2">
            <select>
              <option value="">cold drinks</option>
              <option value="">hot drinks</option>
              <option value="">food</option>
            </select>
          </div>
          <div className="inputContainer p-0 my-2">
            <input type="number" placeholder="price" />
          </div>
          <div className="inputContainer p-0 my-2">
            <input type="file" accept="image/*" />
          </div>
          <div className="p-0 my-2">
            <button>submit</button>
          </div>
        </form>
        <div className="productSide p-0 col-lg-5 col-12 row justify-content-center align-items-center m-0 gap-2">
          <div className="prodItem p-0 col-lg-4 col-10">
            <div className="img">
              <img src="/public/images/StockImages/Coffee.png" alt="" />
            </div>
            <div className="details p-2">
              <h4 className="m-0 pb-1">Product name</h4>
              <h5 className="m-0 p-0">200 EGP</h5>
            </div>
            <div className="actions pb-2 px-2">
              <button>edit</button>
              <button>delete</button>
            </div>
          </div>
          <div className="prodItem p-0 col-lg-4 col-10">
            <div className="img">
              <img src="/public/images/StockImages/Coffee.png" alt="" />
            </div>
            <div className="details p-2">
              <h4 className="m-0 pb-1">Product name</h4>
              <h5 className="m-0 p-0">200 EGP</h5>
            </div>
            <div className="actions pb-2 px-2">
              <button>edit</button>
              <button>delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
