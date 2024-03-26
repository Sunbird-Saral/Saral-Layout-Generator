import React, { useEffect, useState } from "react";
import "./PublishROI.component.css";
import { Link, useLocation } from 'react-router-dom';

const PublishROI = ({ roiJson }) => {
  const [apiUrl, setApiUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [requestData, setRequestData] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [formName, setFormName] = useState('');
  const location = useLocation();

  useEffect(()=>{
    const searchParams = new URLSearchParams(location.search);
    const inputValueFromUrl = searchParams.get('formName');
    if (inputValueFromUrl) {
        setFormName(inputValueFromUrl);
    }
  }, [location])

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/schools/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schoolId: username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        let roiPayload = {
          schemaName: formName,
          roi: roiJson
        }
        setRequestData(roiPayload)
        setToken(data.token);
        setLoggedIn(true);
        setError("");
      } else {
        setError(data.error? data.error: "Server error");
      }
    } catch (error) {
      setError("Failed to log in");
    }
  };

  const handleCallApi = async () => {
    try {
      const response = await fetch(`${apiUrl}/v2/roi`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (response.ok) {
        setResponse("success");
        setError("");
      } else {
        setResponse("error");
        setError(data.message);
      }
    } catch (error) {
      setResponse("error");
      setError("Failed to sync roi");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Publish ROI to Saral backend</h2>
      <div className="card-body">
        {!loggedIn ? (
          <div>
            <h3>Login</h3>
            <input
              type="text"
              placeholder="API URL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-primary" onClick={handleLogin}>
              Login
            </button>
            {error && <div className="error-popup">{error}</div>}
          </div>
        ) : (
          <div>
            <h3>Logged In Successfully!</h3>
            <button className="btn-primary" onClick={handleCallApi}>
              Post ROI to saral backend
            </button>
            {response && <div className="response">
              <h4>Response:</h4>
              {response == "success" ? 
              (<p>Success: &#10003;</p>) : (<p>Failure: &#x274C;</p>)}
              {error && <div className="error-popup">{error}</div>}
            </div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishROI;
