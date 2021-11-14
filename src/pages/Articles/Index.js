import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function Articles(props) {
	const [dataUser, setDataUser] = useState({});
	const [articles, setArticles] = useState([]);
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
		axios.post("/api/articles/getAll", {}).then(req => {
			if (req.data.response === "ok") {
				setArticles(req.data.data);
				setIsLoading(false);
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
			<div className="block">
				<Link className="button green" to="/article/add">Написать статью</Link>
			</div>
			{
				!isLoading
					? <div className="block">
						{
							articles.map((e, i) => {
								return <Link className="button" to={`/articles/get/${e._id}`}>{e.title} <br/>
									<div>
										<div className="left">{e.userName}</div>
										<div className="right">{e.likes}</div>
									</div>
								</Link>
							})
						}
						{
							articles.length === 0
								? <p>Статьей пока нет</p>
								: null
						}
					</div>
					: <p>Loading...</p>
			}
		</div>
	</div>
}

export default withRouter(Articles);

