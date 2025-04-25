import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    
    const payload = {
      email: email,
      password: password,
    };

    try {
      const res = await axios.post("http://localhost:8081/login", payload);
      if (res.status === 200) {
        const token = res.data;
        localStorage.setItem("jwtToken", token);
        console.log("Login Success", token);
        navigate("/Dashboard");
      }
    } catch (err) {
      console.error("Login Failed", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Welcome Back</h4>
          <p className="text-muted text-center mb-4">
            Please login to access your account.
          </p>
          {error && (
            <div className="alert alert-danger text-center py-2" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              style={{ fontWeight: "bold" }}
            >
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <a href="/forgot-password" className="text-decoration-none text-primary">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
