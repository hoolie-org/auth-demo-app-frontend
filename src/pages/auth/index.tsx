import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Icon from "../../components/Icon";
import config from "../../config";
import {createNotification} from "../../helpers/notifications";
import {useAppDispatch} from "../../store/hooks";
import * as commonStore from "../../store/reducers/common";

export default function AuthPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redirect to Hoolie Auth Bot function
  function toHoolieAuthBot() {
    window.open(`https://t.me/hoolieAuthBot?start=${btoa(`${config.AUTH_APP_ID}:${window.socketIo.id}`)}`);
  }

  // Handle socket io
  useEffect(() => {
    const handler = (userId: string) => {
      dispatch(commonStore.actions.setUserId(userId));

      createNotification({
        title: "Successful authentication",
        icon: "check-mark-circle-lined"
      });

      navigate("/");
    };

    window.socketIo.on("authentication", handler);

    return () => {
      window.socketIo.removeListener("authentication", handler);
    };
  });

  // Render
  return (
    <div
      className="page" style={{
      maxWidth: 450
    }}
    >
      <h1>Authentication</h1>

      <p>
        This is demo app for Hoolie Auth platform.<br />You can try it using:
      </p>

      <button
        style={{
          marginTop: 20
        }} onClick={toHoolieAuthBot}
      >
        <Icon icon="lock-14" />
        <span>Auth via Hoolie Auth</span>
      </button>
    </div>
  );
}
