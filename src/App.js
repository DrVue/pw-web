import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import './App.css';
// import "@mdi/font/css/materialdesignicons.min.css";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Region from "./pages/Regions/Index";
import Header from "./components/Header";
import NavBottom from "./components/NavBottom";
import Reg from "./pages/Reg";
import AdminPanel from "./pages/AdminPanel/Index";
import AdminRegions from "./pages/AdminPanel/Regions/Index";
import AdminRegionsSearch from "./pages/AdminPanel/Regions/Search";
import AdminRegionsAdd from "./pages/AdminPanel/Regions/Add";
import Factors from "./pages/Work/Factors";
import Factory from "./pages/Work/Factory";
import FactoryAdd from "./pages/Work/AddFactory";

function App() {
	return <div className="App">
		<BrowserRouter>
			<Header/>
			<Route path="/" exact component={Index}/>
			<Route path="/login" exact component={Login}/>
			<Route path="/reg" exact component={Reg}/>

			<Route path="/home" exact component={Home}/>

			<Route path="/region/search" exact component={AdminRegionsSearch}/>
			<Route path="/region/get/:id" exact component={Region}/>

			<Route path="/work" exact component={Factors}/>
			<Route path="/factory/get/:id" exact component={Factory}/>
			<Route path="/factory/add" exact component={FactoryAdd}/>

			<Route path="/adminPanel" exact component={AdminPanel}/>
			<Route path="/adminPanel/regions" exact component={AdminRegions}/>
			<Route path="/adminPanel/regions/search" exact component={AdminRegionsSearch}/>
			<Route path="/adminPanel/regions/add" exact component={AdminRegionsAdd}/>
			<NavBottom/>
		</BrowserRouter>
	</div>
}

export default App;
