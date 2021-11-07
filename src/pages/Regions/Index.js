import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function Region(props) {
	const [dataUser, setDataUser] = useState({});
	const [region, setRegion] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadMove, setIsLoadMove] = useState(false);
	const [response, setResponse] = useState(null);
	const [err, setErr] = useState(null);

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok") {
					setDataUser(req.data.data);
					get();
				} else {
					props.history.push("/");
				}
			}).catch(() => setIsLoading(false))
		}
	};

	const get = () => {
		axios.post("/api/regions/getOne", {
			id: props.match.params.id,
		}).then(req => {
			if (req.data.response === "ok") {
				setRegion(req.data.data);
				setIsLoading(false);
			} else {
				props.history.push("/home");
			}
		}).catch(() => setIsLoading(false))
	}

	const move = () => {
		setIsLoadMove(true);
		axios.post("/api/regions/move", {
			id: props.match.params.id,
			token: localStorage.getItem("token"),
		}).then(req => {
			if (req.data.response === "ok") {
				checkToken();
				setIsLoadMove(false);
			}
		})
	}

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}
	})

	return <div className="page">
		<div className="content">
			{
				!isLoading
					? <div>
						<div className="block">
							<h3>{region.name}</h3>
							<h3>{region.nameLat}</h3>
						</div>
						<div className="block">
							{
								!isLoadMove
									? dataUser.region !== region._id
										? <button className="button" onClick={move}>Переехать сюда</button>
										: <p>Вы здесь</p>
									: <p>Moving...</p>
							}
						</div>
						<div className="block">
							{
								region.government === "null"
									? <p>Независимый регион</p>
									: null
							}
							{
								region.guber === "null"
									? <p>Без губернатора</p>
									: null
							}
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(Region);