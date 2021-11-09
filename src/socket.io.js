import openSocket from "socket.io-client";
const socket = openSocket("http://192.168.1.40:30011");

export default socket;