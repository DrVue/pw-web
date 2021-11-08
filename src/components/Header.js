import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function Header(props) {
	const [dataUser, setDataUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [response, setResponse] = useState(null);
	const [err, setErr] = useState(null);
	// const [interval] = useState(setInterval(() => checkToken(), 4000))

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok") {
					setDataUser(req.data.data);
					setIsLoading(false);
				} else {
					props.history.push("/");
				}
			})
		}
	};

	// setInterval(() => checkToken(), 1000)

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}

		// setInterval(() => checkToken(), 1000)
	})

	return <div className="">
		{
			!isLoading
				? <div className="header">
					<div>{dataUser.name}</div>
					<div>LVL: {dataUser.lvl} ({dataUser.exp}/{dataUser.expMax})</div>
					<div>E: {dataUser.energy}/{dataUser.energyMax}</div>
					<div>{dataUser.money}$ {dataUser.gold}kg.G</div>
					<Link style={{color: "#fff"}} onClick={checkToken}>Обновить</Link>
				</div>
				: <p></p>
		}
	</div>
}

export default withRouter(Header);