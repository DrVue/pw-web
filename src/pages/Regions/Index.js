import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import Icon from "@mdi/react";
import millify from "millify";
import {mdiAccount, mdiAccountArrowRight, mdiPencil} from "@mdi/js";

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

	const Resource = (props) => {
		return <div style={{ width: "100px", display: "flex", flexDirection: "column", alignItems: "center"}}>
			<span style={{fontSize: "0.8em"}}>{props.name}: </span>
			<Icon style={{padding: "5px 0"}} path={props.icon} size={1.2}/>
			<span>{millify(props.value)} {props.unit}</span>
		</div>
	}

	return <div className="page">
		<div className="content">
			{
				!isLoading
					? <div>
						<div className="block left">
							<b>{region.name}</b> | <b>{region.nameLat}</b>
							<br/>
							<br/>
							{
								region.government === "null"
									? <div>Независимый регион</div>
									: null
							}
							{
								region.guber === "null"
									? <div>Без губернатора</div>
									: null
							}
						</div>
						<div className="block" style={{
							display: "flex",
							justifyContent: "space-around"
						}}>
							<Resource name="Жителей" icon={mdiAccount} value={region.userCount}/>
						</div>
						<div className="block">
							{
								!isLoadMove
									? dataUser.region !== region._id
										? <button className="button green" onClick={move}><Icon size={1} path={mdiAccountArrowRight}/> Переехать сюда</button>
										: <p>Вы здесь</p>
									: <div>Переезд...</div>
							}
							{
								dataUser.priv === 3
									? <Link className="button" to={`/adminPanel/regions/edit/${region._id}`}><Icon size={1} path={mdiAccountArrowRight}/> Редактировать</Link>
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