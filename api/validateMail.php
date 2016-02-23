<?php
	include('../config.php');
	header("Content-Type: application/json; charset=UTF-8");
	$isAvailable = false;
	if(isset($_POST['email'])){
		$user = stripslashes(trim($_POST['email']));
		try{
			$dbh = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USER, DB_PASSWORD);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$dbh->exec("set names 'utf8'");
			
			$sth = $dbh->prepare("SELECT COUNT(`email`) FROM `user` WHERE `email`=?");
			$sth->execute(array($user));
			if($sth->fetchColumn() > 0)
			{	   
				$isAvailable = false;
			}else{
				$isAvailable = true;
			}
		} catch (PDOException $e) {
			echo json_encode(array(
				'valid' => false,
			));
			logResult("Error!: " . $e->getMessage() . "<br/>");
			die();
		}
	}
		
	echo json_encode(array(
		'valid' => $isAvailable,
	));
?>