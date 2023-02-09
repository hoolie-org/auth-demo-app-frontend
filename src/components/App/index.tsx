/*
 * Copyright (c) 2023. Alex Congritta
 *
 * E-Mail: congritta@gmail.com
 * WebSite: https://congritta.com
 */

import classNames from "classnames";
import React, {useEffect, useState} from "react";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import ShadeGenerator, {Shade} from "shade-generator";
import {io} from "socket.io-client";
import config from "../../config";
import AuthPage from "../../pages/auth";
import IndexPage from "../../pages/index";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import * as commonStore from "../../store/reducers/common";
import Icon from "../Icon";
import styles from "./index.module.css";

export default function App() {

  const {userId} = useAppSelector(commonStore.state);

  // Hooks
  const location = useLocation();
  const dispath = useAppDispatch();

  // State
  const [readyToRender, setReadyToRender] = useState(false);

  // Generate color shades to CSS properties
  useEffect(() => {
    const shades = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

    shades.forEach((shade) => (
      document.body.style.setProperty(
        `--accent-color-${shade}`,
        ShadeGenerator.hue(config.ACCENT_COLOR).shade(String(shade) as Shade).hex()
      )
    ));

    shades.forEach((shade) => (
      document.body.style.setProperty(
        `--black-color-${shade}`,
        ShadeGenerator.hue("#AAAAAA").shade(String(shade) as Shade).hex()
      )
    ));
  }, []);

  // Implement socket io
  useEffect(() => {
    if(window.socketIo) {return;}

    window.socketIo = io(config.SOCKETS_URL);

    window.socketIo.on("connect", () => {
      console.info(`Connected to web socket`);
      setReadyToRender(true);
    });
  }, []);

  // Render
  return readyToRender ? (
    userId || location.pathname === "/auth" ? (
      <>

        {/* Header */}
        <header className={styles.header}>
          <h1>{config.SITE_NAME}</h1>

          {userId ? (
            <button
              className={classNames("isZeroed", styles.rightButton)}
              onClick={() => {
                dispath(commonStore.actions.setUserId(null));
              }}
            >
              <Icon icon="log-out-9" />
              <span>Sign Out</span>
            </button>
          ) : null}
        </header>

        {/* Main */}
        <div className={styles.layoutContainer}>

          {/* Main element */}
          <main>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </main>
        </div>
      </>
    ) : <Navigate to="/auth" />
  ) : null;
}
