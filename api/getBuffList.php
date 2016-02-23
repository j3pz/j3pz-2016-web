<?php
	// error_reporting(E_ALL ^ E_NOTICE);
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	include('../libs/MemcacheSASL.php');

	$menpai=stripslashes(trim($_GET['menpai']));
	$cacheQuery = 'buffList_'.$menpai;
	$buffList = false;
	$menpai = "%".$menpai."%";
	if(!LOCAL_MODE){
		$memc = new MemcacheSASL;
		$memc->addServer(MEMCACHED_SERVER, MEMCACHED_PORT);
		$buffList = $memc->get($cacheQuery);
	}
	if(!$buffList){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			$sth = $dbh->prepare("SELECT * FROM `buff` WHERE `menpai` LIKE ?");
			$sth->execute(array($menpai));
			$res = $sth->fetchAll();
			$buffList = array();
			foreach ($res as $row) {
				$dataP = array();
				$dataB = array();
				$indexArr = explode("|", $row['indexNames']);
				$valuePArr = explode("|", $row['percentValue']);
				$valueBArr = explode("|", $row['baseValue']);
				for ($i=0; $i < count($indexArr); $i++) { 
					$dataP[$indexArr[$i]]=$valuePArr[$i];
					$dataB[$indexArr[$i]]=$valueBArr[$i];
				}
				$buff = array(
					'id' => $row['id'],
					'name' => $row['name'],
					'type' => $row['type'],
					'iconId' => $row['iconId'],
					'desc' => $row['description'],
					'isPercent' => $row['isPercent'],
					'isFinal' => $row['isFinal'],
					'dataP' => $dataP,
					'dataB' => $dataB,
					'conflict' => $row['conflict']
				);
				$buffList[] = $buff;
			}
			if(!LOCAL_MODE) $memc->set($cacheQuery, $buffList);
		} catch (PDOException $e) {
			$buffList = array(
				'err' => true,
				'errReason' => "连接数据库失败"
			);
		}
	}
	$jsonText = json_encode($buffList);
	$result = urldecode($jsonText);
	echo $result;
?>