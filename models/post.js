var db = require("./db");

function Post(post) {
	this.message = post.message;
	this.account = post.account;
	this.postDate = post.postDate;
};

Post.prototype.connect = function connect() {
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

Post.prototype.postMsg = function postMsg(connect, sql) {
	var params = [this.message, this.account, this.postDate];
	return new Promise(function(resolve, reject) {
		connect.query(sql, params, function(err, result) {
			if(err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	});
};

Post.prototype.getPost = function postMsg(connect, sql) {
	return new Promise(function(resolve, reject) {
		connect.query(sql, [], function(err, result) {
			if(err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	});
};


module.exports = Post;
