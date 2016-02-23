<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	include('../libs/MemcacheSASL.php');
	$q=stripslashes(trim($_GET["q"]));
	$id=stripslashes(trim($_GET["id"]));
	$menpai=stripslashes(trim($_GET["menpai"]));
	$cacheQuery = 'attributeStoneList_'.$q.'_'.$id.'_'.$menpai;
	if($id=="1"){
		$attribute1=stripslashes(trim($_GET["at1"]));
	}else if($id=="2"){
		$attribute1=stripslashes(trim($_GET["at1"]));
		$attribute2=stripslashes(trim($_GET["at2"]));
	}else if($id=="3"){
		$attribute1=stripslashes(trim($_GET["at1"]));
		$attribute2=stripslashes(trim($_GET["at2"]));
		$attribute3=stripslashes(trim($_GET["at3"]));
	}else if($id=="4"){
		$attribute1=stripslashes(trim($_GET["at1"]));
		$attribute2=stripslashes(trim($_GET["at2"]));
		$attribute3=stripslashes(trim($_GET["at3"]));
		$cacheQuery = 'attributeStone_'.$q;
	}
	$attributeStoneList = false;
	// if(!LOCAL_MODE){
	// 	$memc = new MemcacheSASL;
	// 	$memc->addServer(MEMCACHED_SERVER, MEMCACHED_PORT);
	// 	$attributeStoneList = $memc->get($cacheQuery);
	// }
	if(!$attributeStoneList){
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");

			switch($id){
				case "0":
					$sql="SELECT DISTINCT(attribute1) FROM `attributestone` WHERE `".$menpai."` = 1";
					break;
				case "1":
					$sql="SELECT DISTINCT(attribute2) FROM `attributestone` WHERE `attribute1` = '".$q."' AND `".$menpai."` = 1";
					break;
				case "2":
					$sql="SELECT DISTINCT(attribute3) FROM `attributestone` WHERE `attribute1` = '".$attribute1."' AND `attribute2` = '".$q."' AND `".$menpai."` = 1";
					break;
				case "3":
					$sql="SELECT * FROM attributestone WHERE `attribute1` = '".$attribute1."' AND `attribute2` = '".$attribute2."' AND `attribute3` = '".$q."' AND `".$menpai."` = 1";
					break;
				case "4":
					$sql="SELECT * FROM attributestone WHERE `name` = '".$q."'";
					break;
			}
			$res = $dbh->query($sql);
			foreach ($res as $row) {
				if($id=="4"){
					$attributeStoneList = array(
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
				}else{
					if($id<3){
						$attributeStoneList[$row['attribute'.($id+1)]] = $row['attribute'.($id+1)];
					}else if($id=="3"){
						$attributeStoneList[$row['name']] = $row['name'];
					}
				}
			}
			// if(!LOCAL_MODE) $memc->set($cacheQuery, $attributeStoneList);
		} catch (PDOException $e) {
			$attributeStoneList = array(
				'err' => true,
				'errReason' => "连接数据库失败"
			);
		}
	}
	$jsonText = json_encode($attributeStoneList);
	$result = urldecode($jsonText);
	echo $result;
?>