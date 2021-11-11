import React from "react";

function ProgressBar (props) {
	const styles = {
		main: {
			borderRadius: "28px",
			overflow: "hidden",
			width: "100%",
			height: "20px"
		},
		bar: {
			display: "block",
			backgroundColor: "rgba(0,0,0,0.2)",
		},
		progress: {
			display: "block",
			background: props.color ? props.color : "white",
			padding: "10px 0",
			transition: "width 1s",
			width: props.progress ? props.progress : "0",
		}
	}

	console.log(props.progress);

	return <div className="progressBar" style={styles.main}><span style={styles.bar} className="bar"><span style={styles.progress} className="progress"/></span></div>
}

export default ProgressBar;