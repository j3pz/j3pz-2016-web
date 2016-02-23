<?php
require_once("alipay.config.php");
require_once("../libs/alipay/alipay_notify.class.php");
require '../config.php';
?>
<!DOCTYPE HTML>
<html>
    <head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<?php
include_once("../analysis.php");
//计算得出通知验证结果
$alipayNotify = new AlipayNotify($alipay_config);
$verify_result = $alipayNotify->verifyReturn();
if(1) {//验证成功
	//商户订单号
	$out_trade_no = $_GET['out_trade_no'];
	echo $out_trade_no."<br>";
	//支付宝交易号
	$trade_no = $_GET['trade_no'];
	echo $trade_no."<br>";
	//交易状态
	$trade_status = $_GET['trade_status'];
	echo $trade_status."<br>";
	try {
		$dbh = new PDO('mysql:host=rdsfa32a3yufjby.mysql.rds.aliyuncs.com;port=3306;dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		//$dbh = new PDO('mysql:host=localhost;dbname='.DB_NAME, DB_USER, DB_PASSWORD);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    $dbh->exec("set names 'utf8'");
	    $sql = "SELECT * FROM `order` WHERE `orderID`='".$out_trade_no."';";
	    echo $sql."<br>";
	    $res = $dbh->query($sql);
	} catch (PDOException $e) {
		logResult("Error!: " . $e->getMessage() . "<br/>");
		die();
	}
	
	foreach ($res as $row) {
		$state = $row['state'];
		$item = $row['item'];
    	$uid = $row['uid'];
	}
	echo $state." ".$item." ".$uid."<br/>";

    if($_GET['trade_status'] == 'TRADE_FINISHED' || $_GET['trade_status'] == 'TRADE_SUCCESS') {
		if($state == 'TRADE_IN_PROGRESS'){
			$sql0 = "SELECT `equipNum` FROM `user` WHERE `uid`='".$uid."';";
			echo $sql0."<br>";
			$res0 = $dbh->query($sql0);
			foreach ($res0 as $row) {
				$equipNum = $row['equipNum'];
			}
			echo $equipNum."<br>";
			$finalNum = $equipNum + $item;
			echo $finalNum."<br>";
			$dbh->beginTransaction();
			if($item==10)
    			$sql1 = 'UPDATE `user` SET `equipNum` = "10" WHERE `uid` = "'.$uid.'" AND `equipNum` = "'.$equipNum.'";';
    		else
    			$sql1 = 'UPDATE `user` SET `equipNum` = "'.$finalNum.'" WHERE `uid` = "'.$uid.'" AND `equipNum` = "'.$equipNum.'";';
    		$sql2 = 'UPDATE `order` SET `state` = "TRADE_FINISHED" , `finishTime` = now() , `alipayNo`="'.$trade_no.'" WHERE `orderID` = "'.$out_trade_no.'";';
    		echo $sql1."<br>";
    		echo $sql2."<br>";
    		$sth = $dbh->exec($sql1);
    		$sth = $dbh->exec($sql2);
    		$dbh->commit();
    	}
    }else {
      echo "trade_status=".$_GET['trade_status'];
    }
    
    
		
	echo "支付成功<br />即将跳转到用户页面";//<script>self.location='../user.php'</script>";

	//——请根据您的业务逻辑来编写程序（以上代码仅作参考）——
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
else {
    //验证失败
    //如要调试，请看alipay_notify.php页面的verifyReturn函数
    echo "无效操作";
}
?>
        <title>支付结果</title>
	</head>
    <body>
    </body>
</html>