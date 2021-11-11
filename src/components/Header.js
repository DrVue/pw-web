import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import socket from "../socket.io";
import millify from "millify";
import Icon from "@mdi/react";
import {mdiLightningBolt, mdiArrowUpThick} from "@mdi/js";
import ProgressBar from "./ProgressBar";

function Header(props) {
	const [dataUser, setDataUser] = useState({
		lvl: 0,
		exp: 0,
		expMax: 0,
		money: 0,
		gold: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [response, setResponse] = useState(null);
	const [err, setErr] = useState(null);

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok") {
					// setDataUser(req.data.data);
					socket.connect();
					socket.emit("subscribeToUserInfo", token);
					socket.on("userInfo", data => {setDataUser(data); console.log(data)});
					setIsLoading(false);
				} else {
					props.history.push("/");
				}
			})
		}
	};

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}
	})

	useEffect(() => {
		return () => {
			socket.disconnect();
		}
	}, [])

	return <div className="header">
		{
			!isLoading && dataUser
				? <div>
					<div style={{display: "flex", justifyContent: "spaceBetween", alignItems: "center"}}><Icon path={mdiArrowUpThick} size={1}/><ProgressBar progress={((dataUser.exp / dataUser.expMax) * 100) + "%"}/></div>
					<div style={{display: "flex", justifyContent: "spaceBetween", alignItems: "center"}}><Icon path={mdiLightningBolt} size={1}/><ProgressBar progress={((dataUser.energy / 200) * 100) + "%"}/></div>
					<div>{millify(dataUser.money)}$ {dataUser.gold}kg.G</div>
				</div>
				: <p></p>
		}
	</div>
}

export default withRouter(Header);