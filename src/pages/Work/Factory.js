import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import Resources from "../../components/Resourses";
import socket from "../../socket.io";

function Factory(props) {
	const [dataUser, setDataUser] = useState({});
	const [factory, setFactory] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [response, setResponse] = useState(null);
	const [responseCashOut, setResponseCashOut] = useState(null);
	const [err, setErr] = useState(null);
	const [msg, setMsg] = useState(null);

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok") {
					setDataUser(req.data.data);
					get(req.data.data.region);
				} else {
					props.history.push("/");
				}
			}).catch(() => setIsLoading(false))
		}
	};

	const get = () => {
		axios.post("/api/factory/getOne", {
			id: props.match.params.id,
		}).then(req => {
			if (req.data.response === "ok") {
				setFactory(req.data.data);
				setIsLoading(false);
				// console.log(dataUser._id === factory.userId);
			}
		}).catch(() => setIsLoading(false))
	}

	const work = (e = 10) => {
		setMsg("Working...")
		const token = localStorage.getItem("token");
		axios.post("/api/factory/work", {
			id: props.match.params.id,
			token: token,
			energy: 10,
		}).then(req => {
			if (req.data.response === "ok") {
				setMsg("OK")
				// socket.emit("updateUserInfo", token);
			} else {
				setResponse("err");
				setMsg("Энергия кончилась")
				// socket.emit("updateUserInfo", token);
			}
		})
	}

	const cashOut = (type) => {
		const token = localStorage.getItem("token");
		axios.post("/api/factory/cashOut", {
			id: props.match.params.id,
			token: token,
			type: type,
		}).then(req => {
			if (req.data.response === "ok") {
				setResponseCashOut("ok")
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
							<Link className="button" to="/work">Назад</Link>
							<h3>{factory.name}</h3>
							<h5>{factory.type}</h5>
							<div>LVL: 1</div>
							<div>Доход: {factory.profitMoney}$ +
								{
									factory.type === "gold" ? " " + factory.profitGold + " kg.G" : " " + factory.profitResources + " ед."
								}
							</div>
							<div>Зарплата: {factory.salary * 100}%</div>
						</div>
						<Resources res={dataUser}/>
						<div className="block">
							{
								response === "err"
									? <p>{msg}</p>
									: <p>{msg}</p>
							}
							<button className="button" onClick={work}>Работать (-10 E)</button>
						</div>
						{
							dataUser._id === factory.userId
								? <div className="block">
									<div>Средств на счету: {factory.moneyBank}$ + {factory.goldBank}kg.G</div>
									{
										factory.type !== "gold"
											? <div>Материаов на складе: {factory.resourcesBank} ед</div>
											: null
									}
									<br/>
									{
										responseCashOut === "ok"
											? <p>Готово!</p>
											: null
									}
									<button className="button" onClick={() => cashOut("money")}>Обналичить $</button>
									<button className="button" onClick={() => cashOut("gold")}>Обналичить G</button>
									{
										factory.type !== "gold"
											? <button className="button" onClick={() => cashOut("resources")}>Вывезти материалы</button>
											: null
									}
								</div>
								: null
						}
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(Factory);