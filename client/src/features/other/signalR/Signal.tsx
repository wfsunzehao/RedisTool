import React from "react";
import { useSignalContext } from "../../../app/context/SignalContext";

const Signal: React.FC = () => {
  const { randomObjects, clearRandomObjects, sendRandomObjectManually } = useSignalContext();

  return (
    <div>
      <button onClick={clearRandomObjects}>Clear Objects</button>
      <button onClick={sendRandomObjectManually}>Get Random Object Manually</button>
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
