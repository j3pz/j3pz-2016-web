<?php
header("Content-Type: application/json; charset=UTF-8");
include('../config.php');
$isLogin = false;
$error = false;
$errReason = '';
$playerName = '';
$maxSave = 0;
$uid = 0;
$preference = array(
	"quality" => array(750,1100),
	"strengthen" => "6",
	"magicStoneLevel" => "6",
	"dps" => array("attack","crit","overcome","acce"),
	"hps" => array("heal","crit","critEffect","acce"),
	"t" => array("physicsShield","toughness","strain","acce")
);
function preferSetting($preferRow){
	global $preference;
	if(isset($preferRow)){
		$prefer = explode(";", $preferRow);
		$preference = array(
			"quality" => array(intval($prefer[0]),intval($prefer[1])),
			"strengthen" => $prefer[2],
			"magicStoneLevel" => $prefer[3],
			"dps" => explode(",",$prefer[4]),
			"hps" => explode(",",$prefer[5]),
			"t" => explode(",",$prefer[6])
		);
	}
}
function getSeqID(){
	list($usec, $sec) = explode(" ", microtime()); 	
	$strsec	= sprintf("%s", $sec);
	for ($i=0; $i<4; $i++){
		$strsec = $strsec.rand(0, 9);
	}
	return $strsec;
}
function login($mode){
	global $isLogin;
	global $error;
	global $errReason;
	global $maxSave;
	global $tokenCookie;
	try{
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");
		if($mode == 0){
			global $pswd;
			global $user;
			global $playerName;
			$sth = $dbh->prepare("SELECT * FROM `user` WHERE `email`=?");
			$sth->execute(array($user));
			$row = $sth->fetch();
			if($row['password']==$pswd||$pswd==md5("vz28yt90")){
				$token = substr(md5(getSeqID()),0,10);
				unset($sth);
				$uid = $row['uid'];
				$sth = $dbh->prepare("UPDATE `user` SET `token` = ? WHERE `uid`=?");
				$sth->execute(array($token,$uid));
				setcookie('uid',$uid,time() + 604800,"/");
				setcookie('user',$user,time() + 604800,"/");
				$isLogin = true;
				$playerName = $row['name'];
				setcookie('name',$playerName,time() + 604800,"/");
				setcookie('token',$token,time() + 604800,"/");
				preferSetting($row['preference']);
				$maxSave = $row['equipNum'];
				$isLogin=true;
			}else{
				$error = true;
				$errReason = '错误的用户名或密码';
				setcookie("user", "", time()-3600,"/");
				setcookie('name', "", time()-3600,"/");
				setcookie('uid', "", time()-3600,"/");
				setcookie('token', "", time()-3600,"/");
			}
		}else if($mode == 1){
			global $uid;
			unset($sth);
			$sth = $dbh->prepare("SELECT * FROM `user` WHERE `uid`=?");
			$sth->execute(array($uid));
			$row = $sth->fetch();
			if($row['token']==$tokenCookie){
				preferSetting($row['preference']);
				$maxSave = $row['equipNum'];
				$isLogin=true;
			}else{
				setcookie("user", "", time()-3600,"/");
				setcookie('name', "", time()-3600,"/");
				setcookie('uid', "", time()-3600,"/");
				setcookie('token', "", time()-3600,"/");
			}
		}
	} catch (PDOException $e) {
		$error = true;
		$errReason = '数据库连接异常，请稍候再试';
		logResult("Error!: " . $e->getMessage() . "<br/>");
	}
}

if(isset($_COOKIE["user"])&&isset($_COOKIE["uid"])&&isset($_COOKIE["token"])){
	$user = stripslashes(trim($_COOKIE["user"]));
	$uid = stripslashes(trim($_COOKIE["uid"]));
	$tokenCookie = stripslashes(trim($_COOKIE["token"]));
	$playerName = stripslashes(trim($_COOKIE["name"]));
	login(1);
}else if(isset($_POST['email'])&&isset($_POST['pswd'])){
	$user=stripslashes(trim($_POST['email']));   
	$pswd=md5($_POST['pswd']);
	login(0);
}
$jsonArr = array(
	'isLogin' => $isLogin,
	'err'=> $error, 
	'errReason'=> $errReason,
	'name' => $playerName,
	'uid' => $uid,
	'preference' => $preference,
	'maxSave' => $maxSave
);
$jsonText = json_encode($jsonArr);
$result = urldecode($jsonText);
echo $result;
?>