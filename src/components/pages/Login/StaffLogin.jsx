import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../../components/lib/supabaseClient";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("error logging in:", error.message);
      setError(error.message);
      setLoading(false);
      return;
    }

    // Verify session is stored
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Retrieved session:", session);

    if (data.user) {
      navigate("/admin");
    }

    setLoading(false);
  };

  return (
    <>
      <section className="row justify-content-center align-items-center m-0">
        <div className="col-lg-3 col-11 staffLog text-center">
          <h5 className="pb-3 m-0">staff log-in</h5>
          <form
            onSubmit={handlelogin}
            className="row justify-content-center align-items-center gap-3 m-0"
          >
            {error && (
              <div className="col-lg-10 col-12 text-danger">{error}</div>
            )}
            <div className="inputContainer m-0 p-0 col-lg-10 col-12">
              <label className="m-0 pb-1" htmlFor="email">
                Email adress
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="inputContainer m-0 p-0 col-lg-10 col-12">
              <label className="m-0 pb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="btnArea m-0 p-0 col-lg-10 col-12">
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "log in"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
