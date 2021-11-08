import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function AdminRegionsEdit(props) {
	const [dataUser, setDataUser] = useState({});
	const [region, setRegion] = useState({});
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
					get();
				} else {
					props.history.push("/home");
				}
			})
		}
	};

	const get = () => {
		axios.post("/api/regions/getOne", {
			id: props.match.params.id,
		}).then(async req => {
			if (req.data.response === "ok") {
				setRegion(req.data.data);
				setName(req.data.data.name);
				setNameLat(req.data.data.nameLat);
				await setIsLoading(false);
			} else {
				props.history.push("/home");
			}
		}).catch(() => setIsLoading(false))
	}

	const send = () => {
		axios.post("/api/regions/edit", {
			token: localStorage.getItem("token"),
			id: region._id,
			name: name,
			nameLat: nameLat,
		}).then(req => {
			if (req.data.response === "ok") {
				setResponse("ok");
				props.history.push("/region/get/" + req.data._id);
			} else {
				setResponse("err");
				setErr(req.data.err);
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
						<h3>Редактирование региона</h3>
						<div className="block">
							<div className="form">
								<label htmlFor="regionName">Имя национальное</label>
								<input type="text" id="regionName" className="input" defaultValue={name} onChange={e => setName(e.target.value)}/>
								<label htmlFor="regionNameLat">Имя международное</label>
								<input type="text" id="regionNameLat" className="input" defaultValue={nameLat} onChange={e => setNameLat(e.target.value)}/>
								<button className="button" onClick={send}>Редактировать</button>
							</div>
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(AdminRegionsEdit);