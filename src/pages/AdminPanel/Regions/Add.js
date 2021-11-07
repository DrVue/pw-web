import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function AdminRegionsAdd(props) {
	const [dataUser, setDataUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [response, setResponse] = useState(null);
	const [err, setErr] = useState(null);

	const [name, setName] = useState("");
	const [nameLat, setNameLat] = useState("");

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok" && req.data.data.priv === 3) {
					setDataUser(req.data.data);
					setIsLoading(false);
				} else {
					props.history.push("/home");
				}
			})
		}
	};

	const send = () => {
		axios.post("/api/regions/add", {
			token: localStorage.getItem("token"),
			name: name,
			nameLat: nameLat,
		}).then(req => {
			if (req.data.response === "ok") {
				props.history.push("/regions/get/" + req.data._id);
			} else {
				setResponse("err");
			}
		})
	};

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
						<h3>Добавление региона</h3>
						<div className="block">
							<div className="form">
								<label htmlFor="regionName">Имя национальное</label>
								<input type="text" id="regionName" className="input" onChange={e => setName(e.target.value)}/>
								<label htmlFor="regionNameLat">Имя межsдународное</label>
								<input type="text" id="regionNameLat" className="input" onChange={e => setNameLat(e.target.value)}/>
								<button className="button" onClick={send}>Создать</button>
							</div>
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(AdminRegionsAdd);