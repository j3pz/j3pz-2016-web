<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	$orderList = array();
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
		else $orderList = array('err'=> true,'errReason'=> "您还没有登录");
	}else{
		$orderList = array('err'=> true,'errReason'=> "您还没有登录");
	}

	if($isLogin){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			unset($sth);
			$sth = $dbh->prepare("SELECT * FROM `order` WHERE `uid` = ?");
			$sth->execute(array($uid));
			$res = $sth->fetchAll();
			foreach ($res as $row){
				$order = array(
					'orderId' => $row['orderID'],
					'item' => $row['item']==10?"高端玩家套餐":$row['item']." 格配装位",
					'state' => $row['state'],
					'price' => $row['price']
				);
				$orderList[] = $order;
			}
		} catch (PDOException $e) {
			$orderList = array('err'=> true,'errReason'=>"数据库连接异常，请稍候再试");
		}
	}
	$jsonText = json_encode($orderList);
	$result = urldecode($jsonText);
	echo $result;
?>