import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import Icon from "@mdi/react";
import millify from "millify";
import {mdiThumbUp, mdiThumbDown} from "@mdi/js";

function ArticleGet(props) {
	const [dataUser, setDataUser] = useState({});
	const [article, setArticle] = useState({});
	const [isLoading, setIsLoading] = useState(true);

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
		axios.post("/api/articles/getOne", {
			id: props.match.params.id,
		}).then(req => {
			if (req.data.response === "ok") {
				setArticle(req.data.data);
				setIsLoading(false);
			} else {
				props.history.push("/home");
			}
		}).catch(() => setIsLoading(false))
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
							<div><b>{article.title}</b></div>
							<Link to={`/users/get/${article.userId}`}>{article.userName}</Link>
							<div className="flexRight">
								<button className="n"><Icon path={mdiThumbDown} size={1}/></button>
								<div>{article.likes}</div>
								<button className="n"><Icon path={mdiThumbUp} size={1}/></button>
							</div>
						</div>
						<div className="block left">
							{article.text}
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(ArticleGet);