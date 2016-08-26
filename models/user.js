var db = require("./db");

function User(user) {
	this.name = user.name;
	this.password = user.password;
};

User.prototype.connect = function connect() {
	return new Promise(function(resolve, reject) {
		var connect = db.connectDB();
		connect.connect(function(err) {
			if(err) {
				reject(err);
			}
			else {
				resolve(connect);
			}
		});
	});
};

User.prototype.checkUser = function checkUser(connect, sql) {
	var name = this.name;
	return new Promise(function(resolve, reject) {
		connect.query(sql, [name], function(err, results) {
			if(err)
				reject(err);
			else
				resolve(results);
		});
	});
};

User.prototype.addUser = function addUser(connect, sql) {
	var name = this.name;
	var password = this.password;
	return new Promise(function(resolve, reject) {
		connect.query(sql, [name, password], function(err, results) {
			if(err)
				reject(err);
			else
				resolve(results);
		});
	});
};

User.prototype.getUser = function addUser(connect, sql) {
	return new Promise(function(resolve, reject) {
		connect.query(sql, [], function(err, results) {
			if(err)
				reject(err);
			else
				resolve(results);
		});
	});
};

User.prototype.loginAuth = function loginAuth(connect, sql) {
	var name = this.name;
	return new Promise(function(resolve, reject) {
		connect.query(sql, [name], function(err, results) {
			if(err)
				reject(err);
			else
				resolve(results);
		});
	});
};


module.exports = User;
