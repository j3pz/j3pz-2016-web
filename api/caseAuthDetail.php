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
			$csid = stripslashes(trim($_GET['csid']));
			unset($sth);
			$sth = $dbh->prepare("SELECT `shareTo` FROM `case` WHERE `uid`=? AND `csid`=?");
			$sth->execute(array($uid,$csid));
			$row = $sth->fetch();
			$uidList = explode(",", $row['shareTo']);

			if(isset($_GET['action'])){
				$action = stripslashes(trim($_GET['action']));
				if($action=="get"){
					$result = array();
					unset($sth);
					$sth = $dbh->prepare("SELECT `name` FROM `user` WHERE `uid`=?");
					for ($i=0; $i < count($uidList); $i++) { 
						if($uidList[$i]=="") break;
						$sth->execute(array($uidList[$i]));
						$rowOfUser = $sth->fetch();
						$userItem = array('uid' => $uidList[$i], 'name'=> $rowOfUser['name']);
						$result[] = $userItem;
					}
				}else if($action=="put"&&isset($_GET['mail'])){
					$email = stripslashes(trim($_GET['mail']));
					unset($sth);
					$sth = $dbh->prepare("SELECT COUNT(`email`),`uid`,`name` FROM `user` WHERE `email`=?");
					$sth->execute(array($email));
					$rowOfUser = $sth->fetch();
					if($rowOfUser['COUNT(`email`)']<=0) $result = array('err'=> true,'errReason'=> "用户不存在");
					else{
						$newShareList = (count($row['shareTo'])>0?$row['shareTo'].",":"").$rowOfUser['uid'];
						unset($sth);
						$sth = $dbh->prepare("UPDATE `case` SET `shareTo`=? WHERE `uid`=? AND `csid`=?");
						$sth->execute(array($newShareList,$uid,$csid));
						$result = array('uid' => $rowOfUser['uid'], 'name'=> $rowOfUser['name']);
					}
				}else if($action=="delete"&&isset($_GET['uid'])){
					$deleteUid = stripslashes(trim($_GET['uid']));
					$index = array_search($deleteUid,$uidList);
					if($index>=0){
						array_splice($uidList,$index,1);
						unset($sth);
						$newShareList = join(",",$uidList);
						$sth = $dbh->prepare("UPDATE `case` SET `shareTo`=? WHERE `uid`=? AND `csid`=?");
						$sth->execute(array($newShareList,$uid,$csid));
						$result = array('err'=> false,'errReason'=> "删除成功");
					}else{
						$result = array('err'=> true,'errReason'=> "用户已经被删除");
					}
				}
			}else{
				$result = array('err'=> true,'errReason'=> "参数异常");
			}
		} catch(PDOException $e){
			$result = array('err'=> true,'errReason'=> "数据库连接异常，请稍候再试");
		}
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>