<?php
	header("Content-Type: application/json; charset=UTF-8");
	include('../config.php');

	$isLogin = false;
	$uid = 0;
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

			$id = stripslashes(trim($_POST['issue']));
			$content = stripslashes(trim($_POST['content']));

			unset($sth);
			$sth = $dbh->prepare("SELECT `uid` FROM `issues` WHERE `id`=?;");
			$sth->execute(array($id));
			$row = $sth->fetch();
			if($row['uid']==$uid||$uid==1){
				unset($sth);
				$sth = $dbh->prepare("UPDATE `issues` SET `content` = ? WHERE `id` = ?;");
				$sth->execute(array($content,$id));
			}
			$result = array('err'=> false,'id' => $id, 'content'=>$content);	
		} catch(PDOException $e){
			$result = array('err'=> true,'errReason'=> "数据库连接失败");
		}
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>