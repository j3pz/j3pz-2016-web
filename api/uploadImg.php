<?php
header("Content-Type: application/json; charset=UTF-8");
require_once '../libs/oss/sdk.class.php';
require_once '../libs/oss/util/oss_util.class.php';

$bucket = "j3pz";
$oss = new ALIOSS(OSS_ACCESS_ID, OSS_ACCESS_KEY, OSS_ENDPOINT);

$result = array(
	"success"=>false,
	"msg"=>"",
	"file_path"=>""
);

$fileName = getSeqID();

try {
	if (!isset($_FILES['upload_file']['error']) || is_array($_FILES['upload_file']['error'])) {
		throw new RuntimeException('Invalid parameters.');
	}
	switch ($_FILES['upload_file']['error']) {
		case UPLOAD_ERR_OK:
			break;
		case UPLOAD_ERR_NO_FILE:
			throw new RuntimeException('没有上传文件.');
		case UPLOAD_ERR_INI_SIZE:
		case UPLOAD_ERR_FORM_SIZE:
			throw new RuntimeException('文件过大.');
		default:
			throw new RuntimeException('未知错误.');
	}
	if ($_FILES['upload_file']['size'] > 2048000) {
		throw new RuntimeException('文件过大.');
	}

	$finfo = new finfo(FILEINFO_MIME_TYPE);
	if (false === $ext = array_search(
		$finfo->file($_FILES['upload_file']['tmp_name']),
		array(
			'jpg' => 'image/jpeg',
			'png' => 'image/png',
			'gif' => 'image/gif',
		),
		true
	)) {
		throw new RuntimeException('上传出错，文件格式不正确，网站只允许上传jpg，png或gif文件.');
	}
	if (!move_uploaded_file($_FILES['upload_file']['tmp_name'],sprintf('../temp/%s.%s',$fileName,$ext))){
		throw new RuntimeException('上传出错，文件未能被正确保存.');
	}
	$object = "upload/".$fileName.".".$ext;
	$file_path = '../temp/'.$fileName.".".$ext;
	$options = array();
	$res = $oss->upload_file_by_file($bucket, $object, $file_path, $options);
	unlink($file_path);
	$result["file_path"] = "https://j3pz.oss-cn-hangzhou.aliyuncs.com/upload/".$fileName.".".$ext;
	$result["success"] = true;
} catch (RuntimeException $e) {
	$result['msg'] = $e->getMessage();
}
$jsonText = json_encode($result);
$result = urldecode($jsonText);
echo $result;

function get_extension($filename){
	return pathinfo($filename,PATHINFO_EXTENSION);
}

function getSeqID(){
	list($usec, $sec) = explode(" ", microtime()); 	
	$strsec	= sprintf("%s", $sec);
	for ($i=0; $i<4; $i++){
		$strsec = $strsec.rand(0, 9);
	}
	return $strsec;
}
?>