<?php
	header("Content-Type: application/json; charset=UTF-8");
	require '../config.php';

	$issue = array();
	$comments = array();
	$isLogin = false;
	$uid=0;
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
	if(isset($_GET['q'])){
		$issueId = stripslashes(trim($_GET['q']));
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");
			unset($sth);
			$sth = $dbh->prepare("SELECT * FROM `issues` WHERE `id`=?");
			$sth->execute(array($issueId));
			$row = $sth->fetch();
			if($row['type']=="privacy"&&($uid!=$row['uid']&&($uid!=1&&$uid!=89628))){
				$issue = array(
					'id' => $row['id'], 
					'uid' => 0, 
					'author' => "神秘人",
					'title' => "私密问题", 
					'content' => "<p>**<i>该问题为私密问题，仅限问题的提出人和开发者浏览</i> **</p>", 
					'state' => $row['state'], 
					'label' => array("privacy"), 
					'type' => $row['type'], 
					'direct' => 0, 
					'timestamp' => $row['timestamp'],
				);
				$result = array(
					'err' => false,
					'issue' => $issue,
					'comments' => array()
				);
			}else{
				$issue = array(
					'id' => $row['id'], 
					'uid' => $row['uid'], 
					'title' => $row['title'], 
					'content' => $row['content'], 
					'state' => $row['state'], 
					'label' => explode("|", $row['label']), 
					'type' => $row['type'], 
					'direct' => $row['direct'], 
					'timestamp' => $row['timestamp']
				);
	
				$usr = $dbh->prepare("SELECT `name` FROM `user` WHERE `uid`=?");
				$usr->execute(array($row['uid']));
				$row = $usr->fetch();
				$issue["author"] = $row["name"];
	
				$comment = $dbh->prepare("SELECT * FROM `comments` WHERE `issue`=? ORDER BY `id` ASC");
				$comment->execute(array($issueId));
				$res = $comment->fetchAll();
				foreach ($res as $row) {
					$commentSingle = array(
						'uid' => $row['uid'], 
						'author' => $row['name'],
						'content' => $row['content'],  
						'timestamp' => $row['time'],
						'sysmsg' => $row['sysmsg']
					);
					$comments[] = $commentSingle;
				}
				$result = array(
					'err' => false,
					'issue' => $issue,
					'comments' => $comments
				);
			}

		} catch (PDOException $e) {
			$result = array(
				'err' => true,
				'errReason' => "连接数据库失败"
			);
		}
	}

	$jsonText = json_encode($result);
	$result = urldecode($jsonText);
	echo $result;
?>