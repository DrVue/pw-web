import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import Resources from "../components/Resourses";
import GlobalChat from "../components/GlobalChat";
import axios from "axios";
import Icon from "@mdi/react";
import {mdiCogBox, mdiCity, mdiEmailBox, mdiFactory, mdiExitRun} from "@mdi/js";

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

	const closeNotify = (type = "notifyNewLevel") => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/deleteNotify", {
				token: token,
				type: type,
			}).then(req => {
				if (req.data.response === "ok") {
					checkToken();
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
						{
							dataUser.notifyNewLevel
								? <div className="block">
									Поздравляем с {dataUser.lvl}-ым уровнем
									<button className="button" onClick={() => closeNotify("notifyNewLevel")}>Закрыть</button>
								</div>
								: null
						}
						{
							dataUser.notifyNewMail
								? <div className="block">
									У вас новые сообщения
									<button className="button" onClick={() => closeNotify("notifyNewMail")}>Закрыть</button>
								</div>
								: null
						}
						<div className="block left">
							{
								dataUser.region !== "null"
									? <div>
										<div>{region.name}</div>
										{
											region.government === "null"
												? <div>Независимый регион</div>
												: null
										}
									</div>
									: <p>Вы сейчас находитесь в ни каком регионе</p>
							}
						</div>
						<Resources res={dataUser}/>
						<GlobalChat tag="globalRU"/>
						<div className="block menu">
							{
								dataUser.priv === 3
									? <Link className="button" to="/adminPanel"><Icon path={mdiCogBox} size={1.5}/>Админ</Link>
									: null
							}
							<Link className="button" to="/region/search"><Icon path={mdiCity} size={1.5}/>Регионы</Link>
							<Link className="button" to="/work"><Icon path={mdiFactory} size={1.5}/>Работа</Link>
							<Link className="button" to="/mail"><Icon path={mdiEmailBox} size={1.5}/>Почта</Link>
							<button className="button red" onClick={signOut}><Icon path={mdiExitRun} size={1.5}/>Выход</button>
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(Home);