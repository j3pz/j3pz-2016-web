<?php
	header("Content-Type: application/json; charset=UTF-8");
	include('../config.php');
	include('../libs/MemcacheSASL.php');
	function isInteger($input){
		return(ctype_digit(strval($input)));
	}
	$loadCase = false;
	$saveid = $_GET['id'];
	$isShared = false;
	$caseName = "";
	if(!LOCAL_MODE){
		$memc = new MemcacheSASL;
		$memc->addServer(MEMCACHED_SERVER, MEMCACHED_PORT);
	}
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
		else $loadCase = array('err'=> true,'errReason'=> "您还没有登录");
	}else{
		$loadCase = array('err'=> true,'errReason'=> "您还没有登录");
	}
	if(!isInteger($saveid)) $isShared = true;
	if($isLogin||$isShared){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");
			if($isShared){
				$cacheQueryId = "tinyurl_id_".$saveid;
				$cacheQueryCaseName = "tinyurl_casename_".$saveid;
				$numSaveId = false;
				if(!LOCAL_MODE){
					$numSaveId = $memc->get($cacheQueryId);
					$caseName = $memc->get($cacheQueryCaseName);
				}
				if(!$numSaveId){
					unset($sth);
					$sth = $dbh->prepare("SELECT `uid`,`saveid`,`name`,`isPublic`,`shareTo` FROM `case` WHERE `link` = ?");
					$sth->execute(array($saveid));
					$row = $sth->fetch();
					$originalUid = $row['uid'];
					if($row['isPublic']>0){
						$numSaveId = $row['saveid'];
						$caseName = $row['name'];
					}else{
						$legalUid = explode(",", $row['shareTo']);
						$legalUid[] = $row['uid'];
						$legalUid[] = 1;
						if(!$isLogin) $uid=-1;
						if(in_array($uid, $legalUid)){
							$numSaveId = $row['saveid'];
							$caseName = $row['name'];
						}else{
							$result = array('err'=> true,'errReason'=> "您没有权限读取该方案");
							$jsonText = json_encode($result);
							$result = urldecode($jsonText);
							echo $result;
							exit();
						}
					}
					if(!LOCAL_MODE){
						$memc->set($cacheQueryId, $numSaveId);
						$memc->set($cacheQueryCaseName, $caseName);
					}
				}
				$saveid = $numSaveId;
			}
			$loadCase = array();
			unset($sth);
			$sth = $dbh->prepare("SELECT * FROM `save` WHERE `id` = ?");
			$sth->execute(array($saveid));
			$row = $sth->fetch();
			$saved = $row['save'];
			$buffList = explode(",", $row["buff"]);
			$tixing = substr($saved,-1);
			$positions = array("0_hat","1_jacket","2_belt","3_wrist","4_bottoms","5_shoes","6_necklace","7_pendant","8_ring_1","9_ring_2","a_secondaryWeapon","b_primaryWeapon","c_primaryWeapon");
			$equipList = explode("|", $saved);
			$loadCase['equips'] = array();
			for ($i=0; $i < 13; $i++) { 
				$loadCase['equips'][$positions[$i]] = array();
				$equipDetails = explode(";", $equipList[$i]);
				for ($j=0; $j < 8; $j++) { 
					$equipData[$j] = explode(",", $equipDetails[$j]);
				}
				if($equipData[0][0]>0){
					$equip = false;
					$cacheQuery = 'equip_'.$equipData[0][0];
					if(!LOCAL_MODE) $equip = $memc->get($cacheQuery);
					if(!$equip){
						$sql="SELECT * FROM `equip` WHERE `P_ID` = '".$equipData[0][0]."'";
						$res = $dbh->query($sql);
						$row = $res->fetch();
						unset($res);
						$data = array("P_ID","iconID","name","xinfatype","type","quality","score","body","spirit","strength","agility","spunk","basicPhysicsShield","basicMagicShield","physicsShield","magicShield","dodge","parryBase","parryValue","toughness","attack","heal","crit","critEffect","overcome","acce","hit","strain","huajing","threat","texiao","xiangqian","strengthen","dropSource");
						if($row['texiao']>0){
							$texiaoId = $row['texiao'];
							$sql="SELECT * FROM texiao WHERE id = '".$texiaoId."'";
							$res = $dbh->query($sql);
							$texiao = $res->fetch();
							unset($res);
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
							$sql="SELECT * FROM equipset WHERE setID = '".$texiaoId."'";
							$res = $dbh->query($sql);
							$texiao = $res->fetch();

							$row['texiao'] = array(
								'id' => $texiaoId,
								'name' => $texiao['name'],
								'type' => 'Collection'
							);
							unset($res);
							for ($j=0; $j < 12; $j++) { 
								if ($texiao['pos'.$j]!="") {
									$positionDetail = array(
										'positionId' => $j,
										'equipName' => $texiao['pos'.$j]
									);
									$row['texiao']['components'][] = $positionDetail;
								}
							}
							for ($j=2; $j <= 4; $j++) { 
								if ($texiao['desc'.$j]) {
									$effectArr = explode("|", $texiao['index'.$j]);
									$texiaoDesc = array(
										'conditionNum' => $j,
										'desc' => $texiao['desc'.$j]
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
						$isDecayedEquip = false;
						if($equip['score']==0){
							foreach ($keyZero as $key) {
								$equip[$key]=0;
							}
							$isDecayedEquip = true;
						}
						if(str_word_count(strstr($equip['dropSource'],'br'))>0){
							$source = explode("<br>", $equip['dropSource']);
							$equip['dropSource']= $source[0];
							$equip['prediction']= $source[1];
						}
						if(!LOCAL_MODE) $memc->set($cacheQuery, $equip);
					}
					$loadCase['equips'][$positions[$i]]['equip'] = $equip;
				}else{
					$data = array("P_ID","iconID","name","xinfatype","type","quality","score","body","spirit","strength","agility","spunk","basicPhysicsShield","basicMagicShield","physicsShield","magicShield","dodge","parryBase","parryValue","toughness","attack","heal","crit","critEffect","overcome","acce","hit","strain","huajing","threat","texiao","xiangqian","strengthen","dropSource");
					foreach($data as $key){
						$loadCase['equips'][$positions[$i]]['equip'][$key]=0;
					}
				}	
				// 获取精炼等级
				$loadCase['equips'][$positions[$i]]["strengthen"] = $equipData[1][0];
				// 获取附魔数据
				$data = array("P_ID","name","desc","type","xinfatype","body","spirit","strength","agility","spunk","physicsShield","magicShield","dodge","parryBase","parryValue","toughness","attack","heal","crit","critEffect","overcome","acce","hit","strain","huajing","threat","neihui","neili","xuehui","qixue");
				if($equipData[2][0]==0||$isDecayedEquip){
					for($j=0;$j<30;$j++){
						$loadCase['equips'][$positions[$i]]["enhance"][$data[$j]] = 0;
					}
				}else{
					$enhance = false;
					$cacheQuery = 'enhance_'.$equipData[2][0];
					if(!LOCAL_MODE) $attributeStone = $memc->get($cacheQuery);
					if(!$enhance){
						$sql="SELECT * FROM `enhance` WHERE `P_ID` = '".$equipData[2][0]."'";
						$res = $dbh->query($sql);
						$row = $res->fetch();
						for($j=0;$j<30;$j++){
							$enhance[$data[$j]] = $row[$data[$j]];
						}
						unset($res);
						if(!LOCAL_MODE) $memc->set($cacheQuery, $enhance);
					}
					$loadCase['equips'][$positions[$i]]["enhance"] = $enhance;	
				}
				
				// 镶嵌孔
				$loadCase['equips'][$positions[$i]]["holeIn"] = array($equipData[3][0],$equipData[3][1],$equipData[3][2]);
				$loadCase['equips'][$positions[$i]]["holeLevel"] = array($equipData[4][0],$equipData[4][1],$equipData[4][2]);
				// 淬炼
				$loadCase['equips'][$positions[$i]]["cuilianColour"] = array($equipData[5][0],$equipData[5][1],$equipData[5][2]);
				$loadCase['equips'][$positions[$i]]["cuilianAttr"] = array($equipData[6][0],$equipData[6][1],$equipData[6][2]);
				// 洗炼
				$attrMap = array("0" => 0,"16" => "dodge","17" => "parryBase","18" => "parryValue","19" => "toughness","20" => "attack","21" => "heal","22" => "crit","23" => "critEffect","24" => "overcome","25" => "acce","26" => "hit","27" => "strain");
				$loadCase['equips'][$positions[$i]]["xilian"] = array(
					"level" => $equipData[7][0],
					"origin" => $attrMap[$equipData[7][1]],
					"target" => $attrMap[$equipData[7][2]],
					"ratio" => $equipData[7][3]
				);
			}
			$loadCase["attributestone"] = array();
			for ($i=0; $i < 2; $i++) { 
				$attrStone = explode(",", $equipList[$i+13]);
				if(!isset($attrStone[3])){
					$attributeStone = array(
						"name" => "",
						"level" => "0",
						"attr" => array(
							array(
								"number" => "0",
								"neededAttribute" => "",
								"neededStone" => "0",
								"neededLevel" => "0",
								"attribute" => ""
							),
							array(
								"number" => "0",
								"neededAttribute" => "",
								"neededStone" => "0",
								"neededLevel" => "0",
								"attribute" => ""
							),
							array(
								"number" => "0",
								"neededAttribute" => "",
								"neededStone" => "0",
								"neededLevel" => "0",
								"attribute" => ""
							),
						)
					);
					$loadCase["attributestone"][] = $attributeStone;
					continue;
				} 
				$stoneNameArr = explode(";",$attrStone[3]);
				$stoneName = $stoneNameArr[0];
				$attributeStone = false;
				$cacheQuery = 'attributeStone_'.$stoneName;
				if(!LOCAL_MODE) $attributeStone = $memc->get($cacheQuery);
				if(!$attributeStone){
					$sql="SELECT * FROM attributestone WHERE `name` = '".$stoneName."'";
					$res = $dbh->query($sql);
					$row = $res->fetch();
					unset($res);
					$attributeStone = array(
						"name" => $row["name"],
						"level" => $row["level"],
						"attr" => array(
							array(
								"number" => $row["number1"],
								"neededAttribute" => $row["neededAttribute1"],
								"neededStone" => $row["neededStone1"],
								"neededLevel" => $row["neededLevel1"],
								"attribute" => $row["attribute1"]
							),
							array(
								"number" => $row["number2"],
								"neededAttribute" => $row["neededAttribute2"],
								"neededStone" => $row["neededStone2"],
								"neededLevel" => $row["neededLevel2"],
								"attribute" => $row["attribute2"]
							),
							array(
								"number" => $row["number3"],
								"neededAttribute" => $row["neededAttribute3"],
								"neededStone" => $row["neededStone3"],
								"neededLevel" => $row["neededLevel3"],
								"attribute" => $row["attribute3"]
							),
						)
					);
					// if(!LOCAL_MODE) $memc->set($cacheQuery, $attributeStone);
				}
				$loadCase["attributestone"][] = $attributeStone;
			}
			$loadCase["tixing"] = $tixing;
			$loadCase["isShared"] = $isShared;
			$loadCase["buff"] = $buffList;
			if($isShared){
				unset($sth);
				$sth = $dbh->prepare("SELECT `name` FROM `user` WHERE `uid` = ?");
				$sth->execute(array($originalUid));
				$row = $sth->fetch();

				$loadCase["belongUser"] = $row['name'];
				$loadCase["caseName"] = $caseName;
			}
		} catch (PDOException $e) {
			array('err'=> true,'errReason'=> "连接数据库失败");
		}
	}
	$jsonText = json_encode($loadCase);
	$result = urldecode($jsonText);
	echo $result;
?>