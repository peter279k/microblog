# microblog
The Express.js is a  skeleton application and using MySQL to store data. (微網誌)
# Usage
# Node.js version
## v4.5.0+
## step 1: clone the repo and use the following command in root project folder
  
  ```
  npm install
  ```
  
## step2: create the db.js in /path/to/microblog/models/db.js
  
  ```
  var mysql = require('mysql');

  var connection;
  var settings = {
  	host: 'localhost',
  	port: 3306,
  	user: 'your user name',
  	password: 'your password',
  	database: 'microblog',
  	charset: 'utf8_unicode_ci'
  };

  exports.connectDB = function() {
  	connection = mysql.createConnection(settings);
  	return connection;
  };
  ```
## step3: create the database name: microblog and import the following SQL.
  ```
-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- 主機: 127.0.0.1
-- 產生時間： 2016 广08 ??26 ??19:25
-- 伺服器版本: 5.6.17
-- PHP 版本： 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 資料庫： `microblog`
--

-- --------------------------------------------------------

--
-- 資料表結構 `message`
--

CREATE TABLE IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵ID',
  `message` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '訊息',
  `account` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT '發佈帳號',
  `post_date` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '發佈日期',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='發布訊息欄' AUTO_INCREMENT=3 ;

--
-- 資料表的匯出資料 `message`
--

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `account` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT '帳號',
  `password` varchar(128) COLLATE utf8_unicode_ci NOT NULL COMMENT '密碼',
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='帳號資料表' AUTO_INCREMENT=4 ;

--
-- 資料表的匯出資料 `user`
--

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

  ```
  
## step4: https
  The website has  to use https to protect your website. In this step, we will teach you how to
  
  configure the https for Express.
  
  create the sslLicense.js in the project root path.
  
  ```
  var options = {
    key: fs.readFileSync('/path/to/your-key.key', 'utf8'),
    
    cert: fs.readFileSync('/path/to/your-crt.crt', 'utf8'),
    
    ca: fs.readFileSync('/pathc/to/your-ca.crt', 'utf8'
  ),
  
    //requestCert: true,
    rejectUnauthorized: true,

    // This is the password used when generating the server's key
    // that was used to create the server's certificate.
    // And no, I do not use "password" as a password.
    passphrase: "password"
  };

  //ssl object

  var ssl = {};

  ssl.options = options;

  module.exports = ssl;
  ```
##step5: put the ssl certification files to the ssl folder.

  you have to put the certfication key, csr and CA files.
  
##If you don't know how to generate the csr file and key file, plaes refer the following code:
  
  ```
  openssl genrsa -des3 -out www.yourdomain-example.com.key 2048
  openssl req -new -key www.yourdomain-example.com.key -out www.yourdomain-example.com.csr
  //take the csr file to your https provider or use the https://www.sslforfree.com/ to get the free Let's encrypt certification.
  ```
  
  
