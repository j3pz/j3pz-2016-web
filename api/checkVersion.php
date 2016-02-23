<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	$result = false;
	try{
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");
		
		$sql="SELECT * FROM `config` WHERE `config`='edition'";
		$res = $dbh->query($sql);
		$row = $res->fetch();
		$edition = $row['value'];
		unset($res);
		$sql="SELECT * FROM `config` WHERE `config`='alert'";
		$res = $dbh->query($sql);
		$row = $res->fetch();
		$alert = $row['value'];
		unset($res);
		$result = array('err'=> false,'version'=> $edition, 'desc'=>$alert);
	} catch (PDOException $e) {
		$result = array('err'=> true,'errReason'=> "连接数据库失败");
	}
	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>