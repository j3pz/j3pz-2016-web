<?php
	// error_reporting(E_ALL ^ E_NOTICE);
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	include('../libs/MemcacheSASL.php');

	$position=stripslashes(trim($_GET['pos']));
	$position=$position=="a"?10:$position;
	$position=$position=="b"?11:$position;
	$position=$position=="c"?12:$position;
	
	$menpai=stripslashes(trim($_GET['menpai']));
	$cacheQuery = 'equipList_'.$position.'_'.$menpai;
	$equipList = false;
	
	if(!LOCAL_MODE){
		$memc = new MemcacheSASL;
		$memc->addServer(MEMCACHED_SERVER, MEMCACHED_PORT);
		$equipList = $memc->get($cacheQuery);
	}
	if(!$equipList){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			$equipId = [9,8,10,6,7,5,0,1,2,2,4,11,12];
			$equipDesc = ["帽子","上衣","腰带","护腕","下装","鞋子","项链","腰坠","戒指","戒指","暗器","武器","重剑"];
			$xinfaList = [
				"0" => [ // 内功精简装备
					1 => [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
				"1" => [ // 外功精简装备
					1 => [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0]],
				"2" => [ // 元气装备
					0 => [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 通用元气
					2 => [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 花间
					3 => [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 易筋
					4 => [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 天罗
					5 => [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],// 焚影
				"3" => [ // 根骨装备
					0 => [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 通用根骨
					6 => [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 冰心
					7 => [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 毒经
					8 => [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 紫霞
					13=> [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],// 莫问
				"4" => [ // 力道装备
					0 => [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0], // 通用力道
					4 => [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0], // 惊羽
					9 => [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0], // 傲血
					10=> [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]],// 笑尘
				"5" => [ // 身法装备
					0 => [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0], // 通用身法
					8 => [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0], // 太虚
					11=> [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0], // 藏剑
					12=> [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]],// 分山
				"6" => [ // 治疗装备
					0 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0], // 通用治疗
					2 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], // 离经
					6 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0], // 云裳
					7 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], // 补天
					13=> [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0]],// 相知
				"7" => [ // 防御装备
					0 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1], // 通用防御
					3 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], // 洗髓
					5 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0], // 明尊
					9 => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0], // 铁牢
					12=> [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]] // 铁骨
				];
			$menpaiList = ["huajian","yijin","tianluo","fenying","bingxin","dujing","zixia","mowen","jingyu","aoxue","xiaochen","taixu","cangjian","fenshan","lijing","yunchang","butian","xiangzhi","xisui","mingzun","tielao","tiegu"];
			for ($i=0; $i < 22; $i++) { 
				if($menpai==$menpaiList[$i]) break;
			}
			$sth = $dbh->prepare("SELECT * FROM `equip` WHERE `type`=? ORDER BY `quality`");
			$sth->execute(array($equipId[$position]));
			$res = $sth->fetchAll();
			$equipList = array();
			foreach ($res as $row)
			{
				$available = $xinfaList[$row['xinfa']][$row['menpai']];
				if($available[$i]>0){
					$maxFilter = max($row['physicsShield'],$row['magicShield'],$row['dodge'],$row['parryBase'],1);
					$equipItem = array(
						'id' => $row['P_ID'],
						'quality' => $row['quality'], 
						'name' => $row['name'],
						'class' => $row['uiID'],
						'filter' => array(
							$row['crit']>0?1:0,
							$row['overcome']>0?1:0,
							$row['acce']>0?1:0,
							$row['hit']>0?1:0,
							$row['strain']>0?1:0,
							$row['huajing']>0?1:0,
							$row['heal']>0&&$row['crit']==0&&$row['acce']==0?1:0,
							$maxFilter==$row['physicsShield']?1:0,
							$maxFilter==$row['magicShield']?1:0,
							$maxFilter==$row['dodge']?1:0,
							$maxFilter==$row['parryBase']?1:0,
							$row['parryValue']>0?1:0,
							$row['toughness']>0?1:0
						)
					);
					$equipList[] = $equipItem;
				}
			}
			if(!LOCAL_MODE) $memc->set($cacheQuery, $equipList);
		} catch (PDOException $e) {
			$equipList = array(
				'err' => true,
				'errReason' => "连接数据库失败"
			);
		}
	}
	$jsonText = json_encode($equipList);
	$result = urldecode($jsonText);
	echo $result;
?>