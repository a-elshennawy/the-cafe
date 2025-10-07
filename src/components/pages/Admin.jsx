export default function Admin() {
  return (
    <>
      <section className="container-fluid row justify-content-center align-items-center m-0 gap-1">
        <h3>this page is only for Admins.. be careful</h3>
        <div className="crudSide col-lg-6 col-12">
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
        <div className="productSide col-lg-6 col-12"></div>
      </section>
    </>
  );
}
