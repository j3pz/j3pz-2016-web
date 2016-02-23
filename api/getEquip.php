<?php
	//header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	include('../libs/MemcacheSASL.php');
	$q=stripslashes(trim($_GET["q"]));

	$equip = false;

	$cacheQuery = 'equip_'.$q;
	if(!LOCAL_MODE){
		$memc = new MemcacheSASL;
		$memc->addServer(MEMCACHED_SERVER, MEMCACHED_PORT);
		$equip = $memc->get($cacheQuery);
	}
	if(!$equip){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			$sth = $dbh->prepare("SELECT * FROM `equip` WHERE `P_ID` = ?");
			$sth->execute(array($q));
			
			$data = array("P_ID","iconID","name","xinfatype","type","quality","score","body","spirit","strength","agility","spunk","basicPhysicsShield","basicMagicShield","physicsShield","magicShield","dodge","parryBase","parryValue","toughness","attack","heal","crit","critEffect","overcome","acce","hit","strain","huajing","threat","texiao","xiangqian","strengthen","dropSource");
			$type = array("项链","腰坠","戒指","唯一","远程武器","鞋子","护腕","下装","上衣","帽子","腰带","近身武器","重兵");

			$row = $sth->fetch();
			if($row['texiao']>0){
				$texiaoId = $row['texiao'];
				$txstm = $dbh->prepare("SELECT * FROM texiao WHERE id = ?");
				$txstm->execute(array($texiaoId));
				$texiao = $txstm->fetch();
				$texiaoType = 'Common';
				if(strpos($texiao['desc'],'使用')!==false&&strpos($texiao['desc'],'使用')>=0&&strpos($texiao['desc'],'使用')<=2) 
					$texiaoType = 'Useable';
				$texiaoGroup = explode(";", $texiao['desc']);
				$row['texiao'] = array(
					'id' => $texiaoId,
					'desc' => $texiaoGroup,
					'type' => $texiaoType
				);
			}else if($row['texiao']<0){
				$texiaoId = abs($row['texiao']);
				$txstm = $dbh->prepare("SELECT * FROM equipset WHERE setID = ?");
				$txstm->execute(array($texiaoId));
				$texiao = $txstm->fetch();
				$row['texiao'] = array(
					'id' => $texiaoId,
					'name' => $texiao['name'],
					'type' => 'Collection'
				);
				for ($i=0; $i < 12; $i++) { 
					if ($texiao['pos'.$i]!="") {
						$positionDetail = array(
							'positionId' => $i,
							'equipName' => $texiao['pos'.$i]
						);
						$row['texiao']['components'][] = $positionDetail;
					}
				}
				for ($i=2; $i <= 4; $i++) { 
					if ($texiao['desc'.$i]) {
						$effectArr = explode("|", $texiao['index'.$i]);
						$texiaoDesc = array(
							'conditionNum' => $i,
							'desc' => $texiao['desc'.$i]
						);
						if(count($effectArr)>1){
							$texiaoDesc['effectIndex'] = $effectArr[0];
							$texiaoDesc['effectNum'] = $effectArr[1];
						}
						$row['texiao']['effects'][] = $texiaoDesc;
					}
				}
			}
			foreach($data as $key){
				if($key=="xinfatype"){
					$xinfaList = [
						"0" => [ // 内功精简装备
							1 => "1111111100000000000000"],
						"1" => [ // 外功精简装备
							1 => "0000000011111100000000"],
						"2" => [ // 元气装备
							0 => "1111000000000000000000", // 通用元气
							2 => "1000000000000000000000", // 花间
							3 => "0100000000000000000000", // 易筋
							4 => "0010000000000000000000", // 天罗
							5 => "0001000000000000000000"],// 焚影
						"3" => [ // 根骨装备
							0 => "0000111100000000000000", // 通用根骨
							6 => "0000100000000000000000", // 冰心
							7 => "0000010000000000000000", // 毒经
							8 => "0000001000000000000000", // 紫霞
							13=> "0000000100000000000000"],// 莫问
						"4" => [ // 力道装备
							0 => "0000000011100000000000", // 通用力道
							4 => "0000000010000000000000", // 惊羽
							9 => "0000000001000000000000", // 傲血
							10=> "0000000000100000000000"],// 笑尘
						"5" => [ // 身法装备
							0 => "0000000000011100000000", // 通用身法
							8 => "0000000000010000000000", // 太虚
							11=> "0000000000001000000000", // 藏剑
							12=> "0000000000000100000000"],// 分山
						"6" => [ // 治疗装备
							0 => "0000000000000011110000", // 通用治疗
							2 => "0000000000000010000000", // 离经
							6 => "0000000000000001000000", // 云裳
							7 => "0000000000000000100000", // 补天
							13=> "0000000000000000010000"],// 相知
						"7" => [ // 防御装备
							0 => "0000000000000000001111", // 通用防御
							3 => "0000000000000000001000", // 洗髓
							5 => "0000000000000000000100", // 明尊
							9 => "0000000000000000000010", // 铁牢
							12=> "0000000000000000000001"] // 铁骨
						];
					
					$available = $xinfaList[$row['xinfa']][$row['menpai']];
					$available = base_convert($available, 2, 10);
					$row[$key]=$available;
				}
				$equip[$key]=$row[$key];
			}
			$keyZero = array("body","spirit","strength","agility","spunk","basicPhysicsShield","basicMagicShield","physicsShield","magicShield","dodge","parryBase","parryValue","toughness","attack","heal","crit","critEffect","overcome","acce","hit","strain","huajing","threat");
			if($row['score']==0){
				for ($i=0; $i < count($keyZero); $i++) { 
					$equip[$keyZero[$i]]=0;
				}
			}
			
			if(str_word_count(strstr($equip['dropSource'],'br'))>0){
				$source = explode("<br>", $equip['dropSource']);
				$equip['dropSource']= $source[0];
				$equip['prediction']= $source[1];
			}
			if(!LOCAL_MODE&&$row['score']>0) $memc->set($cacheQuery, $equip);
		} catch (PDOException $e) {
			$equip = array(
				'err' => true,
				'errReason' => "连接数据库失败"
			);
		}
	}
	$jsonText = json_encode($equip);
	$result = urldecode($jsonText);
	echo $result;
?>