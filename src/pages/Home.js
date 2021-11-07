import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function Home(props) {
	const [dataUser, setDataUser] = useState({});
	const [region, setRegion] = useState({});
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
					setDataUser(req.data.data);
					setIsLoading(false);
					if (req.data.data.region !== "null") {
						getRegion(token, req.data.data.region);
					}
				} else {
					props.history.push("/");
				}
			})
		}
	};

	const signOut = () => {
		localStorage.removeItem("token");
		props.history.push("/?reload=true");
	}

	const getRegion = (token, id) => {
		axios.post("/api/regions/getOne", {
			token: token,
			id: id,
		}).then(req => {
			if (req.data.response === "ok") {
				setRegion(req.data.data);
			}
		})
	}

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}

		if (props.location.search === "?reload=true") {
			document.location.href = "/home";
		}
	})

	return <div className="page">
		<div className="content">
			{
				!isLoading
					? <div>
						<div className="block">
							{
								dataUser.region !== "null"
									? <div>
										<p>{region.name}</p>
										{
											region.government === "null"
												? <p>Независимый регион</p>
												: null
										}
									</div>
									: <p>Вы сейчас находитесь в ни каком регионе</p>
							}
						</div>
						<div className="block">
							{
								dataUser.priv === 3
									? <Link className="button" to="/adminPanel">Админ-панель</Link>
									: null
							}
							<Link className="button" to="/region/search">Регионы</Link>
							<button className="button" onClick={signOut}>Выход</button>
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(Home);