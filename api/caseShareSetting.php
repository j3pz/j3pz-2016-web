<?php
	header("Content-Type: application/json; charset=UTF-8");
	include('../config.php');

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

			$csid = stripslashes(trim($_GET['csid']));
			if(isset($_GET['pub'])){
				$isPublic = stripslashes(trim($_GET['pub']));
				if($csid==0){
					unset($sth);
					$sth = $dbh->prepare("UPDATE `case` SET `isPublic`=? WHERE `uid`=?");
					$sth->execute(array($isPublic,$uid));
					$res = $sth->rowCount();
					if($res <= 0) $result = array('err'=> true,'errReason'=> "修改失败，方案可能不存在，请联系开发者");
					else {
						$result = array('isPublic'=> $isPublic>0);
					}
				}else{
					unset($sth);
					$sth = $dbh->prepare("UPDATE `case` SET `isPublic`=? WHERE `uid`=? AND `csid`=?");
					$sth->execute(array($isPublic,$uid,$csid));
					$res = $sth->rowCount();
					unset($sth);
					if($res <= 0) $result = array('err'=> true,'errReason'=> "修改失败，方案可能不存在，请联系开发者");
					else {
						$result = array('isPublic'=> $isPublic>0);
					}
				}
			}
		} catch(PDOException $e){
			$result = array('err'=> true,'errReason'=> "数据库连接异常，请稍候再试".$e->getMessage());
		}
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>