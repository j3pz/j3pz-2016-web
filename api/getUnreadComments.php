<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';

	$comments = array();
	$isLogin = false;
	$uid=0;
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
	}
	if($uid==1||$uid==89628){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			$read = $dbh->prepare("SELECT `value` FROM `config` WHERE `configId`=3");
			$read->execute();
			$row = $read->fetch();
			$unreadStart = $row['value'];

			$comment = $dbh->prepare("SELECT * FROM `comments` WHERE `sysmsg`='comment' AND `id`>? ORDER BY `id` ASC");
			$comment->execute(array($unreadStart));
			$res = $comment->fetchAll();
			$commentId = 0;
			foreach ($res as $row) {
				$commentSingle = array(
					'uid' => $row['uid'], 
					'issue' => $row['issue'],
					'author' => $row['name'],
					'content' => $row['content'],  
					'timestamp' => $row['time'],
					'sysmsg' => $row['sysmsg']
				);
				$comments[] = $commentSingle;
				$commentId = $row['id'];
			}
			$result = array('comments'=>$comments,'latest'=>$commentId);
		} catch (PDOException $e) {
			$result = array(
				'err' => true,
				'errReason' => "连接数据库失败"
			);
		}
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>