import { useState } from "react";
import "./form.css";

const DropContainer = ({ onDrop, isFirstDrop }) => {
  const [dropArea, setDropArea] = useState(false);
  return (
    <div
      className={
        isFirstDrop ? "initial_drop_area" : dropArea ? "drop_area" : "hide_drop"
      }
      onDrop={() => {
        onDrop();
        setDropArea(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDropArea(true)}
      onDragLeave={() => setDropArea(false)}
    >
      Drop Here
    </div>
  );
};

export default DropContainer;
