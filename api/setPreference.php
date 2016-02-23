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

			unset($sth);
			$sth = $dbh->prepare("SELECT `preference` FROM `user` WHERE `uid`=?");
			$sth->execute(array($uid));
			$row = $sth->fetch();
			$old = explode(";",$row['preference']);
			$err = false;
			if(!$err&&isset($_GET['qualityMin'])&&isset($_GET['qualityMax'])){
				$qualityMin = intval($_GET['qualityMin']);
				$qualityMax = intval($_GET['qualityMax']);
				if($qualityMin<450||$qualityMin>1100||$qualityMax<450||$qualityMax>1100){
					$err = true;
					$result = array('err'=>true,'errReason'=> "参数不合法");
				}else{
					$old[0] = $qualityMin;
					$old[1] = $qualityMax;
				}
			}
			if(!$err&&isset($_GET['strengthen'])){
				$strengthen = intval($_GET['strengthen']);
				if($strengthen<0||$strengthen>6){
					$err = true;
					$result = array('err'=>true,'errReason'=> "参数不合法");
				}else{
					$old[2] = $strengthen;
				}
			}
			if(!$err&&isset($_GET['magicStoneLevel'])){
				$magicStoneLevel = intval($_GET['magicStoneLevel']);
				if($magicStoneLevel<0||$magicStoneLevel>8){
					$err = true;
					$result = array('err'=>true,'errReason'=> "参数不合法");
				}else{
					$old[3] = $magicStoneLevel;
				}
			}
			if(!$err&&isset($_GET['dps'])){
				$dps = stripslashes(trim($_GET['dps']));
				$old[4] = $dps;
			}
			if(!$err&&isset($_GET['hps'])){
				$hps = stripslashes(trim($_GET['hps']));
				$old[5] = $hps;
			}
			if(!$err&&isset($_GET['t'])){
				$t = stripslashes(trim($_GET['t']));
				$old[6] = $t;
			}
			if(!$err){
				$new = implode(";", $old);
				$sthe = $dbh->prepare("UPDATE `user` SET `preference`=? WHERE `uid`=?");
				$sthe->execute(array($new,$uid));
			}
			$result = array('err'=> false,'errReason'=> "");
		} catch(PDOException $e){
			$result = array('err'=> true,'errReason'=> "数据库连接失败");
		}
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>