import React, { useEffect } from "react";
import { useSignalContext } from "../../../app/context/SignalContext";

const Signal: React.FC = () => {
  const { randomObjects, clearRandomObjects, startTimerManually, stopTimerManually } = useSignalContext();

  useEffect(() => {
    console.log("Updated randomObjects:", randomObjects);
  }, [randomObjects]);

  return (
    <div>
      <button onClick={clearRandomObjects}>Clear Objects</button>
      <button onClick={startTimerManually}>Start Timer Manually</button>
      <button onClick={stopTimerManually}>Stop Timer Manually</button>
      <h3>Random Objects Received:</h3>
      <ul>
        {randomObjects.map((obj, index) => (
          <li key={index}>
            <strong>{obj.name}</strong> - {obj.time} - <em>{obj.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Signal;
