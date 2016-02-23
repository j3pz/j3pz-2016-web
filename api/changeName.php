<?php
	header("Content-Type: application/json; charset=UTF-8");
	include('../config.php');
	$uid = 0;
	$newName = $_GET['name'];
	if($newName=="") $newName = "未命名";
	$isLogin = false;
	if(isset($_COOKIE["user"])&&isset($_COOKIE["uid"])){
		$uid = stripslashes(trim($_COOKIE["uid"]));
		$token = stripslashes(trim($_COOKIE["token"]));
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");

		$sth = $dbh->prepare("SELECT `name`,`token` FROM `user` WHERE `uid`=?");
		$sth->execute(array($uid));
		$row = $sth->fetch();
		$usrName = $row['name'];
		if($row['token']==$token) $isLogin = true;
		else $result = array('err'=> true,'errReason'=> "您还没有登录");
	}else{
		$result = array('err'=> true,'errReason'=> "您还没有登录");
	}
	if($isLogin){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			unset($sth);
			$sth = $dbh->prepare("UPDATE `user` SET `name`=? WHERE `uid` =?");
			$sth->execute(array($newName,$uid));
			$res = $sth->rowCount();
			if($res <= 0) $result = array('err'=> true,'errReason'=> "修改失败，请联系开发者");
			else {
				$result = array('name'=> $newName);
				$_SESSION['name']=$newName;
				setcookie('name',$newName,time() + 604800,"/");
			}
		} catch (PDOException $e) {
			$result = array('err'=> true,'errReason'=> "数据库连接异常，请稍候再试");
			logResult("Error!: " . $e->getMessage() . "<br/>");
		}
	}
	
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>