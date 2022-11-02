import React from "react";

const ProgressBar = (props) => {
    const { bgcolor, completed, itemsLeft } = props;

    const containerStyles = {
        height: 40,
        width: '100%',
        backgroundColor: "rgb(206, 225, 253, 0.05)",
        borderRadius: 5,
        position: "relative",
        overflow: "hidden"
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        display: "flex",
        justifyContent: "center",
    }

  const labelStyles = {
    padding: 0,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: "39px",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)"
  }
    
  return (
    <div style={containerStyles}>
      <span style={labelStyles}>{completed < 100 ? `${completed}% ` +  props.itemsLeft : "SOLD OUT"}</span>
    <div style={fillerStyles}></div>
  </div>
  );
};

export default ProgressBar;