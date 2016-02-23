<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	$position=stripslashes(trim($_GET['q']));
	$posName=stripslashes(trim($_GET['str']));
	$position=$position=="a"?10:$position;
	$position=$position=="b"?11:$position;
	$position=$position=="c"?12:$position;
	$equipId = [9,8,10,6,7,5,0,1,2,2,4,11,12];
	$searchEquipList = array();
	try {
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    $dbh->exec("set names 'utf8'");
		$sth = $dbh->prepare("SELECT * FROM `equip` WHERE `name` Like ? AND `type`=? ORDER BY `quality`");
		$posName = "%".$posName."%";
		$sth->execute(array($posName,$equipId[$position]));
		$res = $sth->fetchAll();
		unset($sth);
		$ops = array();
		$opsqc = array();
		$k = 0;
		$i = 0;
		foreach ($res as $row){
			if(strstr($row['name'],"千重")){
				$opsqcID[$i] = $row['P_ID'];
				$opsqcIcon[$i] = $row['iconID'];
				$opsqc[$i++] = $row['name'];
				continue;			
			}else{
				$equipItem = [
					'id' => $row['P_ID'],
					'name' => $row['name'],
					'icon' => $row['iconID']
				];
				$searchEquipList[] = $equipItem;
				$k++;
			}
		}
		$j = $i-1;
		while($j>=0){
			$equipItem = [
				'id' => $opsqcID[$j],
				'name' => $opsqc[$j],
				'icon' => $opsqcIcon[$j--]
			];
			$searchEquipList[] = $equipItem;
			$k++;
		}
		if($k==0) $searchEquipList = array(
			'err' => true,
			'errReason' => "未找到相应装备"
		);
	} catch (PDOException $e) {
		$searchEquipList = array(
			'err' => true,
			'errReason' => "连接数据库失败"
		);
	}
	$jsonText = json_encode($searchEquipList);
	$result = urldecode($jsonText);
	echo $result;
?>