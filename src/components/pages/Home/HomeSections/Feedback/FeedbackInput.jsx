export default function FeedbackInput() {
  return (
    <>
      <div className="feedbackSection row justify-content-start align-items-center m-0 p-2 gap-1">
        <form className="feedbackForm col-lg-3 col-12 row justify-content-start align-items-center m-0 p-2 gap-1">
          <input type="text" placeholder="your name..." />
          <textarea cols={10} rows={5}>
            your feedback...
          </textarea>
          <button>send</button>
        </form>
        <div className="customerFeeds col-lg-6 col-12"></div>
      </div>
    </>
  );
}
