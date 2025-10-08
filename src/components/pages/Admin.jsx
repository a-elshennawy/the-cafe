export default function Admin() {
  return (
    <>
      <section className="container-fluid row justify-content-center align-items-center m-0 gap-1">
        <div className="navTabs col-12 text-center">
          <button>orders</button>
          <button>inventory</button>
        </div>
        <div className="InvSection col-12">
          <div className="crudSide">
            <input type="search" placeholder="search product name..." />
            <form className="crudForm py-3">
              <div className="inputContainer">
                <input type="text" placeholder="product name" />
              </div>
              <div className="inputContainer">
                <input type="text" placeholder="product description" />
              </div>
              <div className="inputContainer">
                <select>
                  <option value="">cold drinks</option>
                  <option value="">hot drinks</option>
                  <option value="">food</option>
                </select>
              </div>
              <div className="inputContainer">
                <input type="number" placeholder="price" />
              </div>
              <div className="inputContainer">
                <input type="file" accept="image/*" />
              </div>
              <button>submit</button>
            </form>
          </div>
          <div className="productSide"></div>
        </div>
      </section>
    </>
  );
}
