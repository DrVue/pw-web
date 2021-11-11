import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import millify from "millify";
import ProgressBar from "../../components/ProgressBar";
import Resources from "../../components/Resourses";

function GetUser(props) {
	const [dataUser, setDataUser] = useState({});
	const [user, setUser] = useState({});
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
		axios.post("/api/users/get", {
			idUser: props.match.params.id,
		}).then(req => {
			if (req.data.response === "ok") {
				setUser(req.data.data);
				getRegion(req.data.data.region);

			} else {
				props.history.push("/home");
			}
		}).catch(() => setIsLoading(false))
	}

	const getRegion = (id) => {
		axios.post("/api/regions/getOne", {
			id: id,
		}).then(req => {
			if (req.data.response === "ok") {
				setRegion(req.data.data);
				setIsLoading(false);
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
						<div className="block left">
							<b>{user.name}</b>
							<br/><br/>
							<div>
								LVL {user.lvl}
							</div>
						</div>
						{
							dataUser._id === props.match.params.id
								? <div className="block left">
									<b>Опыт</b>
									<br/>
									<div className="textBig">({millify(dataUser.exp)}/{millify(dataUser.expMax)}) EXP</div>
									<ProgressBar progress={((dataUser.exp / dataUser.expMax) * 100) + "%"}/>
								</div>
								: null
						}
						{
							dataUser._id === props.match.params.id
								? <div className="block left">
									<b>Счёт</b>
									<br/>
									<div className="textBig">{dataUser.money}$</div>
									<div className="textBig">{dataUser.gold} kg.G</div>
								</div>
								: null
						}
						{
							dataUser._id !== props.match.params.id
								? <div className="block"><Link className="button" to={"/mail/new/" + user._id}>Написать
									сообщение</Link></div>
								: null
						}
						<div className="block left">
							{
								user.region !== "null"
									? <div>
										<div>{region.name}</div>
										{
											region.government === "null"
												? <div>Независимый регион</div>
												: null
										}
									</div>
									: <p>Этот пользователь находится где-то вне измерений</p>
							}
						</div>
						<div className="block left">
							<div className="textField">
								<div className="textLeft">Дата последнего входа:</div>
								<div className="textRight">{moment(user.lastLogin).format("DD/MM HH:mm")}</div>
							</div>
							<div className="textField">
								<div className="textLeft">Дата регистрации:</div>
								<div className="textRight">{moment(user.regDate).format("DD/MM/YYYY")}</div>
							</div>
							<div className="textField">
								<div className="textLeft">Опыт работы:</div>
								<div className="textRight">{millify(user.expFactory)}</div>
							</div>
						</div>
						{
							dataUser._id === props.match.params.id
								? <Resources res={dataUser}/>
								: null
						}
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(GetUser);