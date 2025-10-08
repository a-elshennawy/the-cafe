export default function FeedbackInput() {
  return (
    <>
      <div className="row justify-content-center align-items-center m-0 gap-1">
        <form className="feedbackForm col-lg-4 col-10 row justify-content-center align-items-center m-0 gap-1">
          <input type="text" placeholder="your name..." />
          <textarea cols={10} rows={5}>
            write your feedback...
          </textarea>
          <button>send</button>
        </form>
      </div>
    </>
  );
}
