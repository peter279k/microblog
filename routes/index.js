var express = require('express');
var crypto = require('crypto');
var User = require('../models/user');
var Post = require('../models/post');
var router = express.Router();

var regMsg = {
	'errorMessage': '',
	'resultMessage': '',
	'alertDiv': '',
	'alertDivEnd': '',
	'warnDiv': '',
	'warnDivEnd': '',
	'user': false,
	'year': (new Date().getYear() + 1900).toString(),
	'posts': null
};

/*force redirect to https*/
function ensureSecure(req, res, next) {
	if(req.secure) {
		// OK, continue
		return next();
  	};
	
	// handle port numbers if you need non defaults
 	// res.redirect('https://' + req.host + req.url); // express 3.x
	res.redirect('https://' + req.hostname + ":5000" + req.url); // express 4.x
};

router.all('*', ensureSecure); // at top of routing calls


/* GET home page. */
router.get('/', function(req, res) {
	regMsg["user"] = false;
	
	if(req.session.user != undefined)
		regMsg["user"] = true;

	if(req.flash()["resultMessage"] && regMsg["user"] == false) {
		regMsg["warnDiv"] = '<div class="alert alert-info">';
		regMsg["warnDivEnd"] = '</div>';
		regMsg["resultMessage"] = req.flash()["resultMessage"];
		getPost('index', regMsg, res);
	}
	
	if(regMsg["user"]) {
		regMsg["warnDiv"] = '';
		regMsg["warnDivEnd"] = '';
		regMsg["resultMessage"] = '';
		
		regMsg["alertDiv"] = '';
		regMsg["alertDivEnd"] = '';
		regMsg["errorMessage"] = '';
		
		if(req.flash()["resultMessage"]) {
			regMsg["warnDiv"] = '<div class="alert alert-info">';
			regMsg["warnDivEnd"] = '</div>';
			regMsg["resultMessage"] = req.flash()["resultMessage"];
		}
		if(req.flash()["errorMessage"]) {
			regMsg["alertDiv"] = '<div class="alert alert-error">';
			regMsg["alertDivEnd"] = '</div>';
			regMsg["errorMessage"] = req.flash()["errorMessage"];
		}
		
		getPost('main', regMsg, res);
	}
	else {
		regMsg["warnDiv"] = '';
		regMsg["warnDivEnd"] = '';
		regMsg["resultMessage"] = "";
		
		getPost('index', regMsg, res);
	}
	
});

/* GET user */
router.get('/u/:user', function(req, res) {
	
});

/* POST post */
router.post('/post', function(req, res) {

	if(req.session.user == undefined) {
		req.flash('errorMessage', '未登入！');
		return res.redirect('/login');
	}
	
	var message = req.body["message"];
	
	if(message == undefined) {
		req.flash('errorMessage', "請輸入要發佈的內容");
		return res.redirect('/');
	}
	
	if(message.length > 50) {
		req.flash('errorMessage', "發佈文章文字需要在 50 字以內");
		return res.redirect('/');
	}
	
	if(message.length !== 0) {
		var post = new Post({
			message: message,
			account: req.session.user,
			postDate: new Date().toString()
		});
		
		var connect;
		post.connect()
		.then(function(connection) {
			connect = connection;
			post.postMsg(connect, "INSERT INTO message(message, account, post_date) VALUES(?, ?, ?)")
			.then(function(result) {
				if(result["affectedRows"] === 1) {
					req.flash('resultMessage', "發佈成功！");
					return res.redirect('/');
				}
				else {
					req.flash('errorMessage', "發佈失敗！");
					return res.redirect('/');
				}
			})
			.catch(function(error) {
				req.flash('errorMessage', '系統出錯');
				console.log(JSON.stringify(error));
				return res.redirect('/');
			});
		})
		.catch(function(error) {
			req.flash('errorMessage', '系統出錯');
			console.log(JSON.stringify(error));
			return res.redirect('/');
		});
	}
});

/* GET reg */
router.get('/reg', function(req, res) {
	regMsg["alertDiv"] = '';
	regMsg["alertDivEnd"] = '';
	regMsg["errorMessage"] = '';
	
	regMsg["warnDiv"] = '';
	regMsg["warnDivEnd"] = '';
	regMsg["resultMessage"] = '';
	
	if(req.flash()['errorMessage'] !== undefined) {
		regMsg["alertDiv"] = '<div class="alert alert-error">';
		regMsg["alertDivEnd"] = '</div>';
		regMsg["errorMessage"] = req.flash()["errorMessage"];
		res.render('reg', regMsg);
	}
	else if(req.flash()['resultMessage'] !== undefined) {
		regMsg["warnDiv"] = '<div class="alert alert-info">';
		regMsg["warnDivEnd"] = '</div>';
		regMsg["resultMessage"] = req.flash()["resultMessage"];
		res.render('reg', regMsg);
	}
	else
		res.render('reg', regMsg);
});

/* POST doReg */
router.post('/reg', function(req, res) {
	if(req.body["password-repeat"] !== req.body["password"]) {
		req.flash('errorMessage', '兩次輸入密碼不一致！');
		return res.redirect('/reg');
	}
	
	if(req.body["username"] == "") {
		req.flash('errorMessage', '尚未輸入使用者！');
		return res.redirect('/reg');
	}
	
	if(req.body["username"].length > 10) {
		req.flash('errorMessage', '使用者名稱須在 10 字以內！');
		return res.redirect('/reg');
	}
	
	if(req.body["password-repeat"] == "" || req.body["password"] == "") {
		req.flash('errorMessage', '密碼未輸入！');
		return res.redirect('/reg');
	}
	
	//generate the password hash
	var sha2 = crypto.createHash('sha512');
	var passwordHash = sha2.update(req.body["password"]).digest('base64');
	
	var user = new User({
		name: req.body["username"],
		password: passwordHash
	});
	
	var connect;
	user.connect()
	.then(function(connection) {
		connect = connection;
		user.checkUser(connect, "SELECT COUNT(*) AS userCount FROM user WHERE account = ?")
		.then(function(count) {
			if(count[0]["userCount"] === 0) {
				user.addUser(connect, "INSERT INTO user(account, password) VALUES(?, ?)")
				.then(function(result) {
					if(result["affectedRows"] === 1) {
						req.flash('resultMessage', "註冊成功！");
						return res.redirect('/reg');
					}
				})
				.catch(function(err) {
					req.flash('errorMessage', JSON.stringify(err));
					return res.redirect('/reg');
				});
			}
			else {
				req.flash('resultMessage', '此帳號名稱已經有註冊！');
				return res.redirect('/reg');
			}
		})
		.catch(function(err) {
			req.flash('errorMessage', JSON.stringify(err));
			return res.redirect('/reg');
		});
	})
	.catch(function(err) {
		req.flash('errorMessage', err);
		return res.redirect('/reg');
	});
});

/* GET login */
router.get('/login', function(req, res) {
	if(req.session.user != undefined) {
		return res.redirect('/');
	}
	if(req.flash()['errorMessage'] !== undefined) {
		regMsg["alertDiv"] = '<div class="alert alert-error">';
		regMsg["alertDivEnd"] = '</div>';
		regMsg["errorMessage"] = req.flash()["errorMessage"];
		res.render('login', regMsg);
	}
	else
		res.render('login', regMsg);
});

/* POST login */
router.post('/login', function(req, res) {
	
	if(req.body["password"] == "") {
		req.flash('errorMessage', '尚未輸入密碼！');
		return res.redirect('/login');
	}
	
	if(req.body["username"] == "") {
		req.flash('errorMessage', '尚未輸入帳號！');
		return res.redirect('/login');
	}
	
	var sha2 = crypto.createHash('sha512');
	var passwordHash = sha2.update(req.body["password"]).digest('base64');
	
	var user = new User({
		name: req.body["username"],
		password: passwordHash
	});
	
	var connect;
	user.connect().then(function(connection) {
		connect = connection;
		user.loginAuth(connect, "SELECT account AS account,password AS passowrd FROM user WHERE account = ?")
		.then(function(result, passwordHash) {
			if(result.length === 0) {
				req.flash('errorMessage', '使用者不存在！');
				return res.redirect('/login');
			}
			
			var sha2 = crypto.createHash('sha512');
			var passwordHash = sha2.update(req.body["password"]).digest('base64');
			
			if(result[0]["passowrd"] !== passwordHash) {
				req.flash('errorMessage', '密碼錯誤！');
				return res.redirect('/login');
			}
			else {
				//write the session value
				
				req.session.user = result[0]["account"];
				req.flash('resultMessage', '登入成功');
				return res.redirect('/');
			}
		})
		.catch(function(error) {
			req.flash('errorMessage', '系統出錯');
			console.log(JSON.stringify(error));
			return res.redirect('/login');
		});
	})
	.catch(function(error) {
		req.flash('errorMessage', '系統出錯');
		console.log(JSON.stringify(error));
		return res.redirect('/login');
	});
	
});

/* GET logout */
router.get('/logout', function(req, res, next) {
	if(req.session.user == undefined) {
		req.flash('errorMessage', '未登入！');
		return res.redirect('/login');
	}
	next();
});

router.get('/logout', function(req, res) {
	req.session.user = undefined;
	req.flash('resultMessage', '登出成功！')
	return res.redirect('/');
});

function getPost(ejsName, regMsg, res) {
	var connect;
	var post = new Post({
		message: '',
		account: '',
		postDate: ''
	});
	
	post.connect()
	.then(function(connection) {
		connect = connection;
		post.getPost(connect, "SELECT message AS message, account AS account, post_date AS post_date FROM message")
		.then(function(result) {
			regMsg["posts"] = result;
			res.render(ejsName, regMsg);
		})
		.catch(function(error) {
			regMsg["errorMessage"] = '系統出錯';
			console.log(JSON.stringify(error));
			res.render(ejsName, regMsg);
		});
	})
	.catch(function(error) {
		regMsg["errorMessage"] = '系統出錯';
		console.log(JSON.stringify(error));
		res.render(ejsName, regMsg);
	});
	
}


module.exports = router;
