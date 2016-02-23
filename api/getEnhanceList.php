<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	include('../libs/MemcacheSASL.php');

	$position=stripslashes(trim($_GET['pos']));
	$position=$position=="a"?10:$position;
	$position=$position=="b"?11:$position;
	$position=$position=="c"?11:$position;
	
	$menpai=stripslashes(trim($_GET['menpai']));
	$cacheQuery = 'enhanceList_'.$position.'_'.$menpai;
	$enhanceList = false;
	
	if(!LOCAL_MODE){
		$memc = new MemcacheSASL;
		$memc->addServer(MEMCACHED_SERVER, MEMCACHED_PORT);
		$enhanceList = $memc->get($cacheQuery);
	}
	if(!$enhanceList){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			$equipId = [9,8,10,6,7,5,0,1,2,2,4,11,12];
			$equipDesc = ["帽子","上衣","腰带","护腕","下装","鞋子","项链","腰坠","戒指","戒指","暗器","武器","重剑"];
			$xinfaList = [
				0 => [1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0], // 内功通用附魔
				1 => [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1], // 外功通用附魔
				2 => [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 元气通用附魔
				3 => [0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0], // 根骨通用附魔
				4 => [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0], // 力道通用附魔
				5 => [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0], // 身法通用附魔
				6 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0], // 治疗通用附魔
				7 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1], // 防御通用附魔
				8 => [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0], // 天罗内功附魔
				9 => [0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1], // 天罗外功附魔
				10=> [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 全部通用附魔
				];
			$menpaiList = ["huajian","yijin","tianluo","fenying","bingxin","dujing","zixia","mowen","jingyu","aoxue","xiaochen","taixu","cangjian","fenshan","lijing","yunchang","butian","xiangzhi","xisui","mingzun","tielao","tiegu"];
			for ($i=0; $i < 20; $i++) { 
				if($menpai==$menpaiList[$i]) break;
			}

			$sth = $dbh->prepare("SELECT * FROM `enhance` WHERE `type`=?");
			$sth->execute(array($equipId[$position]));
			$res = $sth->fetchAll();
			$enhanceList = array();
			foreach ($res as $row)
			{
				$available = $xinfaList[$row['xinfatype']];
				if($available[$i]>0){
					$enhanceItem = array(
						'id' => $row['P_ID'],
						'name' => $row['name']
						);
					$enhanceList[] = $enhanceItem;
				}
			}
			if(!LOCAL_MODE) $memc->set($cacheQuery, $enhanceList);
		} catch (PDOException $e) {
			$enhanceList = array(
				'err' => true,
				'errReason' => "连接数据库失败"
			);
		}
	}
	$jsonText = json_encode($enhanceList);
	$result = urldecode($jsonText);
	echo $result;
?>