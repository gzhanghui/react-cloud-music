import React from "react";
function PlayingIcon() {
  return (
    <div className="beat">
      {[1, 2, 3, 4].map((item) => {
        return <span key={item}></span>;
      })}
    </div>
  );
}

export default PlayingIcon