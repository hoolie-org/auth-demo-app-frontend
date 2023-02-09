/*
 * Copyright (c) 2023. Alex Congritta
 *
 * E-Mail: congritta@gmail.com
 * WebSite: https://congritta.com
 */

import axios from "axios";
import {useEffect, useState} from "react";
import Loader from "../../components/Loader";
import config from "../../config";
import onError from "../../helpers/onError";
import UserModel from "../../models/User";
import {useAppSelector} from "../../store/hooks";
import * as commonStore from "../../store/reducers/common";

export default function IndexPage() {

  const {userId} = useAppSelector(commonStore.state);

  // State
  const [user, setUser] = useState<UserModel|null>(null);

  // Load user data
  useEffect(() => {
    if(user) {return;}

    axios.get<UserModel>(`${config.API_URL}/getUserInfo`, {
      params: {
        userId
      }
    })
      .then(({data}) => {
        setUser(data);
      })
      .catch(onError);
  }, []);

  // Render
  return user ? (
    <div className="page">
      <h1>My Profile</h1>

      <div
        style={{
          maxWidth: 450,
          margin: "0 auto"
        }}
      >

        <div
          style={{
            width: 150,
            height: 150,
            margin: "50px auto 0"
          }}
        >
          <img
            alt={`${user.firstName} ${user.lastName}`}
            style={{
              borderRadius: "50%"
            }}
            src={`http://127.0.0.1:3004/${user.telegramId}.jpg`}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: "24pt"
          }}
        >
          {user.firstName} {user.lastName}
        </div>
      </div>
    </div>
  ) : (
    <div className="loader-container">
      <Loader color={config.ACCENT_COLOR} size={70} width={5} spinsPerSecond={1.5} />
    </div>
  );
}
