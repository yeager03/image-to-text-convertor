// express
const express = require("express");

// dotenv
const { config } = require("dotenv");

// routes
const router = require("./router");

// cors
const cors = require("cors");

// init our app
config();

const server = express();

// middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
	cors({
		origin: process.env.CLIENT_URL,
	})
);

// routes
server.use("/", router);

const PORT = process.env.PORT || 5000;

const start = async () => {
	try {
		server.listen(PORT, () => {
			console.log(`Server is running at http://localhost:${PORT}`);
		});
	} catch (error) {
		throw new Error(error.message);
	}
};

start();
