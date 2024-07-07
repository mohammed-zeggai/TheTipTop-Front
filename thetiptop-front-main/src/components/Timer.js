import { React, useState, useEffect } from "react";
import axios from "axios";

const Timer = () => {
  const [deadline, setDeadline] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/dates`;
      axios
        .get(url)
        .then((res) =>
          setDeadline(Number(res.data.start) + Number(res.data.duration))
        );
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getTime = (deadline) => {
    const time = new Date(deadline * 1000) - Date.now();
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getTime(deadline);
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <>
      <div
        className="Timer"
        style={{ overflow: "hidden", whiteSpace: "nowrap" }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontFamily: "-apple-system",
            textAlign: "center",
          }}
        >
          Pour jouer, il vous reste :
          <br />
          {days < 10 ? "0" + days : days} J {hours < 10 ? "0" + hours : hours} H{" "}
          {minutes < 10 ? "0" + minutes : minutes} m{" "}
          {seconds < 10 ? "0" + seconds : seconds} s
        </div>
      </div>
    </>
  );
};

export default Timer;
