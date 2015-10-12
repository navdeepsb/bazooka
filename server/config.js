module.exports = {
	app: {
		name: "Bazooka",
		league: "La Liga",
		teams: 20,
		currRound: 1, // highly volatile
		isRoundInProgress: false // highly volatile
	},
	db: {
		uri: "mongodb://localhost:27017/bazooka",
		username: "",
		password: ""
	},
	server: {
		port: 8090,
		logLevel: "debug"
	}
};