export default function StaffLogin() {
  return (
    <>
      <section className="row justify-content-center align-items-center m-0">
        <div className="col-lg-3 col-11 staffLog text-center">
          <h5 className="pb-3 m-0">staff log-in</h5>
          <form className="row justify-content-center align-items-center gap-3 m-0">
            <div className="inputContainer m-0 p-0 col-lg-10 col-12">
              <label className="m-0 pb-1" htmlFor="email">
                Email adress
              </label>
              <input type="email" id="email" />
            </div>
            <div className="inputContainer m-0 p-0 col-lg-10 col-12">
              <label className="m-0 pb-1" htmlFor="password">
                Password
              </label>
              <input type="password" id="password" />
            </div>
            <div className="btnArea m-0 p-0 col-lg-10 col-12">
              <button>log in</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
