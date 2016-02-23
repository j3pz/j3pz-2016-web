<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	include('../libs/MemcacheSASL.php');
	$q=stripslashes(trim($_GET["q"]));
	$enhance = false;
	$cacheQuery = 'enhance_'.$q;

	if(!LOCAL_MODE){
		$memc = new MemcacheSASL;
		$memc->addServer(MEMCACHED_SERVER, MEMCACHED_PORT);
		$enhance = $memc->get($cacheQuery);
	}
	if(!$enhance){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			$sth = $dbh->prepare("SELECT * FROM `enhance` WHERE `P_ID` = ?");
			$sth->execute(array($q));
			$res = $sth->fetchAll();
			$data = array("P_ID","name","desc","type","xinfatype","body","spirit","strength","agility","spunk","physicsShield","magicShield","dodge","parryBase","parryValue","toughness","attack","heal","crit","critEffect","overcome","acce","hit","strain","huajing","threat","neihui","neili","xuehui","qixue");

			foreach ($res as $row) {
				for($i=0;$i<30;$i++){
					$enhance[$data[$i]] = $row[$data[$i]];
				}
			}
			if(!LOCAL_MODE) $memc->set($cacheQuery, $enhance);
		} catch (PDOException $e) {
			$enhance = array(
				'err' => true,
				'errReason' => "连接数据库失败"
			);
		}
	}
	$jsonText = json_encode($enhance);
	$result = urldecode($jsonText);
	echo $result;
?>