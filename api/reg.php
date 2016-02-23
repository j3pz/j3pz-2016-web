<?php
	include('../config.php');
	header("Content-Type: application/json; charset=UTF-8");
	$user=stripslashes(trim($_POST['email']));
	$pswd=md5(stripslashes(trim($_POST['password'])));
	$name=stripslashes(trim($_POST['username']));
	$error = false;
	$errReason = '';
	$playerName = '';
	$uid = 0;

	try{
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");

		$sth = $dbh->prepare("SELECT COUNT(`email`) FROM `user` WHERE `email`=?");
		$sth->execute(array($user));
		if($sth->fetchColumn() > 0)
		{	   
			$error = true;
			$errReason = '该邮箱已被注册';
		}else{
			unset($sth);
			$token = substr(md5(getSeqID()),0,10);
			$sth = $dbh->prepare("INSERT INTO `user` (`uid`,`email`,`password`,`name`,`equipNum`,`lastlogin`,`weiboak`,`weibosk`,`preference`,`token`) VALUES (NULL,?,?,?,'3','','','','475;615;6;6;attack,crit,overcome,acce;heal,crit,critEffect,acce;magicShield,toughness,strain,acce',?);");
			$sth->execute(array($user,$pswd,$name,$token));
			$uid=$dbh->lastInsertId('uid');

			setcookie('uid',$uid,time() + 604800,"/");
			setcookie('user',$user,time() + 604800,"/");
			setcookie('name',$name,time() + 604800,"/");
			setcookie('token',$token,time() + 604800,"/");
		}
	} catch (PDOException $e) {
		$error = true;
		$errReason = '数据库连接失败';
		logResult("Error!: " . $e->getMessage() . "<br/>");
	}
	$jsonArr = array(
		'err'=> $error, 
		'errReason'=> $errReason,
		'name' => $playerName,
		'uid' => $uid
	);
	$jsonText = json_encode($jsonArr);
	$result = urldecode($jsonText);
	echo $result;

	function getSeqID(){
		list($usec, $sec) = explode(" ", microtime()); 	
		$strsec	= sprintf("%s", $sec);
		for ($i=0; $i<4; $i++){
			$strsec = $strsec.rand(0, 9);
		}
		return $strsec;
	}
?>