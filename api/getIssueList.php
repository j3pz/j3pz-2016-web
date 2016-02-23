<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';
	$uid = 0;
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
	}

	$issueList = array();
	$result = array();
	$state = 1;
	$search = false;
	$page = 1;
	if(isset($_GET['state'])){
		$state = stripslashes(trim($_GET['state']));
		$page = stripslashes(trim($_GET['pn']));
	}else if(isset($_GET['search'])){
		$search = "%".stripslashes(trim($_GET['search']))."%";
	}
	try{
		$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$dbh->exec("set names 'utf8'");
		$offset = ($page - 1) * 20;
		if($uid == 1||$uid==89628) $private = "none";
		else $private = "privacy";
		if(!$search){
			unset($sth);
			$sth = $dbh->prepare("SELECT `id`,`title`,`content`,`label`,`timestamp`,`direct` FROM `issues` WHERE `state`=? AND `type`!=? ORDER BY `id` DESC LIMIT ?,21;");
			$sth->bindParam(1, $state, PDO::PARAM_STR);
			$sth->bindParam(2, $private, PDO::PARAM_STR);
			$sth->bindParam(3, $offset, PDO::PARAM_INT);
			$sth->execute();
			$res = $sth->fetchAll();
		}else{
			unset($sth);
			$sth = $dbh->prepare("SELECT `id`,`title`,`content`,`label`,`timestamp`,`direct` FROM `issues` WHERE `type`!=? And `title` LIKE ? OR `content` LIKE ?  ORDER BY `id` DESC LIMIT ?,21;");
			$sth->bindParam(1, $private, PDO::PARAM_STR);
			$sth->bindParam(2, $search, PDO::PARAM_STR);
			$sth->bindParam(3, $search, PDO::PARAM_STR);
			$sth->bindParam(4, $offset, PDO::PARAM_INT);
			$sth->execute();
			$res = $sth->fetchAll();
		}
		unset($sth);
		$comment = $dbh->prepare("SELECT count(`id`) FROM `comments` WHERE `issue`=? AND `sysmsg`='comment'");
		$count = 0;
		$result['nextPage'] = $page;
		foreach ($res as $row) {
			if($count<20){
				$comment->execute(array($row['id']));
				$commentNumRow = $comment->fetch();
				$cmtNum = $commentNumRow["count(`id`)"];
				$briefText = strip_tags($row['content']);
				if(strlen($briefText)>45){
					$briefText = substr($briefText, 0, 45)."...";
				}
				$issue = array(
					'id' => $row['id'], 
					'state' => $state,
					'title' => $row['title'], 
					'content' => $briefText, 
					'label' => explode("|", $row['label']), 
					'timestamp' => $row['timestamp'],
					'direct' => $row['direct'],
					'comments' => $cmtNum
				);
				$issueList[] = $issue;
			}else{
				$result['nextPage'] = $page+1;
			}
			$count++;
		}
		$result['previousPage'] = $page-1;
		$result['issueList'] = $issueList;
	} catch (PDOException $e) {
		$result = array(
			'err' => true,
			'errReason' => "连接数据库失败"
		);
	}

	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>