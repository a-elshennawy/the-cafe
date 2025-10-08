export default function SearchComp() {
  return (
    <>
      <div className="searchContainer row justify-content-start align-items-center gap-2 m-0">
        <input
          className="col-lg-6 col-8"
          type="search"
          placeholder="search to order..."
        />
        <button className="col-lg-1 col-2">search</button>
      </div>
    </>
  );
}
