<?php
	header("Content-Type: application/json; charset=UTF-8");
	include('../config.php');
	$uid = 0;
	$newPass=md5(stripslashes(trim($_POST['pass'])));
	if($newPass==""){
		$isLogin = false;
		$result = array('err'=> true,'errReason'=> "密码不能为空");
	}
	try{
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");

		$token = stripslashes(trim($_GET['token'])); 
		$uid = stripslashes(trim($_GET['uid'])); 

		$sth = $dbh->prepare("SELECT * FROM user WHERE `uid`=?");
		$sth->execute(array($uid));
		$row = $sth->fetch();
		$show = false;
		if($row){ 
			$mt = md5($row['uid']."ziofat".$row['lastlogin']); 
			if($mt==$token){ 
				if(time()-$row['lastlogin']>24*60*60){ 
					$result = array('err'=> true,'errReason'=> '该链接已过期！'); 
				}else{ 
					unset($sth);
					$sth = $dbh->prepare("UPDATE `user` SET `password`=? WHERE `uid` = ?");
					$sth->execute(array($newPass,$uid));
					$res = $sth->rowCount();
					if($res <= 0) $result = array('err'=> true,'errReason'=> "修改失败，请联系开发者");
					else {
						$result = array('err'=> false);
					}
				} 
			}else{ 
				$result = array('err'=> true,'errReason'=> '无效的链接');
			} 
		}else{ 
			$result = array('err'=> true,'errReason'=> '错误的链接！');	 
		} 
	} catch (PDOException $e) {
		$result = array('err'=> true,'errReason'=> "数据库连接异常，请稍候再试");
		logResult("Error!: " . $e->getMessage() . "<br/>");
	}
	
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>