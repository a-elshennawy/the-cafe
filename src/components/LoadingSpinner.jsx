import { PacmanLoader } from "react-spinners";

export default function LoadingSpinner() {
  return (
    <>
      <div className="loader">
        <PacmanLoader speedMultiplier={1} color="#75485e" />
      </div>
    </>
  );
}
