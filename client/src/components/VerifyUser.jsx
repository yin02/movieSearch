import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../AuthTokenContext';
import "../style/appLayout.css";

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verifyUser() {
      if (!accessToken) {
        setError("Access Token not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const user = await response.json();
        if (user.auth0Id) {
          navigate("/app");
        } else {
          throw new Error("Verification failed, no Auth0 ID returned.");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setError("Your account already be login,please go back to try one more time.");

      }
    }

    verifyUser();
  }, [accessToken, navigate]);

  return (
    <div className="verify-user">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="error">{error}</div>
      )}
    </div>
  );
}
