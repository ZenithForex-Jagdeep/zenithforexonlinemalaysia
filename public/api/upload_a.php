<?php
session_start();
require_once('dbio_c.php');
require_once('upload_c.php');
$dbio = new Dbio();
$upload = new FileUpload();
$requestObject = json_decode($_POST["1"]);
require_once("right_c.php");
$right = new Right();
//$right->getUserNavRight($dbio,$requestObject->right);

if($requestObject->name == 'upload'){
    $upload->uploadDocument($dbio, $requestObject);
    echo json_encode($upload);
}else if ($requestObject->name == "uploadCheque"){
    $upload->uploadCheque($dbio, $requestObject);
    echo json_encode($upload);
}else if($requestObject->name == "uploadCard"){
    $upload->uploadCard($dbio, $requestObject);
    echo json_encode($upload);
}else if($requestObject->name == 'updateGalleryImg'){
    $upload->uplodaGalleryPost($dbio, $requestObject);
    echo json_encode($upload);
}else if($requestObject->name == 'blogPost'){
    $upload->uploadBlogPost($dbio, $requestObject);
    echo json_encode($upload);
}else if($requestObject->name == 'uploadCV'){
    echo json_encode($upload->uploadCareerResume($dbio, $requestObject));
}else if($requestObject->name == 'uploadtieupdoc'){
    $upload->uploadTieupDoc($dbio, $requestObject);
    echo json_encode($upload);
}else if($requestObject->name == "uploadExcel"){
    $upload->uploadLeadData($dbio, $requestObject);
    echo json_encode($upload);
}else if($requestObject->name == "budget"){
    $upload->uploadBudgetData($dbio, $requestObject);
    echo json_encode($upload);
} else if($requestObject->name == "invoice"){
    $upload->uploadCorpInvoice($dbio, $requestObject);
    echo json_encode($upload);
} else if($requestObject->name == "thirdpartycrm"){
    $upload->uploadThirdParty($dbio, $requestObject);
    echo json_encode($upload);
}else if($requestObject->name == "uploadConveyanceDocument"){
    $upload->uploadConveyanceDocs($dbio, $requestObject);
    echo json_encode($upload);
}else if($requestObject->name == "uploadcorpleads"){
    $a=$upload->UploadCorpLeads($dbio, $requestObject);
    echo json_encode($a);
}
else {
    echo "{'msg':'No Matching Arguments'}";
}


?>