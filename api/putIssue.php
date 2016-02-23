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

			$type = stripslashes(trim($_POST['type']));
			$title = stripslashes(trim($_POST['title']));
			$content = stripslashes(trim($_POST['content']));
			$state = 1;
			if($type=="update"){
				if($uid==1||$uid==89628){
					$state = 3;
					$version = $title;
					$title = date("Y")."年".date("m")."月".date("d")."日 更新记录";
					$sql="UPDATE `config` SET `value`='".$version."' WHERE `config` = 'edition'";
					$res = $dbh->query($sql);
					unset($res);
					$sql="UPDATE `config` SET `value`='".$content."' WHERE `config` = 'alert'";
					$res = $dbh->query($sql);
					unset($res);
				}else{
					$result = array('err'=> true,'errReason'=> "非法操作");
					$jsonText = json_encode($result);
					$result = urldecode($jsonText);
					echo $result;
					exit();
				}
			}
			unset($sth);
			$sth = $dbh->prepare("INSERT INTO `issues` (`uid`,`title`,`content`,`state`,`type`,`timestamp`) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP);");
			$sth->execute(array($uid,$title,$content,$state,$type));
			$issueId = $dbh->lastInsertId();
			$result = array('err'=> false,'id' => $issueId);	
		} catch(PDOException $e){
			$result = array('err'=> true,'errReason'=> "数据库连接失败");
		}
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>