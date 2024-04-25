import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useRef } from "react";
import { useAuthToken } from '../AuthTokenContext';

export default function Profile() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();
  const [userInfo, setuserInfo] = useState(user)

  const [newname, setnewname] = useState(user.name);
  const [showRename, setShowRename] = useState(false)

  useEffect(() => {
    async function runGetUser() {

      try {
        // get access token silently from Auth0, which will be stored in the context
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getuser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          }
        });


        if (res.status == 200) {
          const data = await res.json()
          if (data) setuserInfo({ ...user, name: data.name })
        }


      } catch (err) {
        console.log(err);
      }
    }
    runGetUser()


  }, [userInfo, user]);


  async function updateUserName() {

    const newUser = Object.assign(user, {
      name: newname
    })

    // insert a new todo item, passing the accessToken in the Authorization header
    try {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newUser),
      });
      if (data.ok) {
        setShowRename(false)


      } else {
        return null;
      }
    } catch (error) {
      console.log('fetch update-user error:', error)
    }
  }

  return (
    <div>

      {
        !showRename ? <div className="flex">
          <p>Name: {userInfo.name}</p>
          <button onClick={() => setShowRename(true)}>rename</button>
        </div> : <div>
          <input
            type="text"
            name="item"
            id="item"
            value={newname}
            onChange={(e) => setnewname(e.target.value)}
          />
          <div>
            <button onClick={() => setShowRename(false)}>cancel</button>
            <button onClick={updateUserName}>sure</button>
          </div>
        </div>

      }

      <div>
        <p>
          avatar: <img src={userInfo.picture} width="70" alt="profile avatar" />

        </p>
      </div>
      <div>
        <p>📧 Email: {userInfo.email}</p>
      </div>
      <div>
        <p>🔑 Auth0Id: {userInfo.sub}</p>
      </div>
      <div>
        <p>✅ Email verified: {userInfo.email_verified?.toString()}</p>
      </div>
    </div>
  );
}
