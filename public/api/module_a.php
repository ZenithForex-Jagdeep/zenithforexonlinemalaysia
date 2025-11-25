<?php
session_start();
require_once("dbio_c.php");
require_once("module_c.php");
require_once('right_c.php');
require_once('cashfree_c.php');

$dbio = new Dbio();
$option = $_POST["2"];
$session = $_POST["1"];
$module = new CorpModule();
$cashfree = new CashFree();
if($session == "external_source"){
    if($option == "getdocs"){
        echo json_encode($module->getDocsToUpload($dbio, $_POST["3"]));
    }elseif($option == 'validate_user'){
        echo json_encode($module->validate_user($dbio, $_POST["3"]));
    }elseif($option == "getfile"){
        echo json_encode($module->getFileData($dbio, json_decode($_POST["3"])));
    }else if($option == "orderhistory") {
        $module->getOrderHistory($dbio, $_POST["3"] , "external");

        echo json_encode($module);
    }elseif($option == "decrypt_url_data"){
        echo json_encode($dbio->decryptData($_POST["3"]));
    }elseif($option == "expire_link"){
        echo json_encode($module->ExpireLink($dbio , $_POST["3"]));
    }
    else {
    echo '{"msg": "MSG0010"}';
}
}
else if($dbio->validateSession($session)){
    $right = new Right();
    $right->getUserNavRight($dbio,"CORPMODULE");
    if ($option == "getcorpdata" and $right->query == 1){
        $module->getCorpData($dbio, $_POST["3"]);
        echo json_encode($module);
    } else if($option == "saveleaddata" and $right->query == 1){
        $module->saveLeadDetail($dbio, json_decode($_POST["3"]));
        echo json_encode($module);
    } else if($option == "getdata" and $right->query == 1){
        echo json_encode($module->getLeadData($dbio, json_decode($_POST["3"]), $right));
    } else if($option == "getdatabysrno"){
        $module->getLeadDataBySrno($dbio, $_POST["3"]);
        echo json_encode($module);
    } else if($option == "getisdandentity"){
        echo json_encode($module->getEntityList($dbio));
    } else if($option == "addisdmargin"){
        $module->addIsdMargin($dbio, json_decode($_POST["3"]));
        echo json_encode($module);
    } else if($option == "getmarginlist"){
        echo json_encode($module->getIsdMarginList($dbio, $_POST["3"]));
    } else if($option == "deletemargin"){
        $module->deleteMargin($dbio, $_POST["3"]);
        echo json_encode($module);
    } else if($option == "getentities"){
        echo json_encode($module->getEntities($dbio));
    } else if($option == "getentitybyid"){
        $module->getEntityById($dbio, $_POST["3"]);
        echo json_encode($module);
    } else if($option == "addentity"){
        $obj = json_decode($_POST["3"]);
        if($obj->entityid*1 > 0){
            $module->editEntity($dbio, $obj);
        } else {
            $module->addNewEntity($dbio, $obj);
        }
        echo json_encode($module);
    } else if($option == "uniquenum"){
        $module->getUniqueNum($dbio);
        echo json_encode($module);
    } else if($option == "addproduct"){
        $module->addProductDetail($dbio, json_decode($_POST["3"]));
        echo json_encode($module);
    } else if($option == "getproductlist"){
        echo json_encode($module->getProductList($dbio, $_POST["3"]));
    } else if($option == "deleteproduct"){
        $module->deleteProduct($dbio, $_POST["3"]);
        echo json_encode($module);
    } else if($option == "getisdrate"){
        $module->getIsdLiveRate($dbio, json_decode($_POST["3"]));
        echo json_encode($module);
    } else if($option == "savetraveller") {
        $module->saveTravellerDetail($dbio, json_decode($_POST["3"]));
        echo json_encode($module);
    } else if($option == "orderhistory") {
        $module->getOrderHistory($dbio, $_POST["3"]);
        echo json_encode($module);
    } else if($option == "backofcdata"){
        $module->getBackOfcData($dbio, $_POST["3"]);
        echo json_encode($module);
    } else if($option == "activitylog"){
        echo json_encode($module->getActivityLogData($dbio, $_POST["3"]));
    } else if($option == "updatestatus"){
        $module->updateOrderStatus($dbio, json_decode($_POST["3"]));
        echo json_encode($module);
    } else if($option == "saverates"){
        $module->saveChangedRates($dbio, json_decode($_POST["3"]), json_decode($_POST["4"]));
        echo json_encode($module);
    } else if($option == "addcomment"){
        echo json_encode($module->addComment($dbio, json_decode($_POST["3"])));
    } else if($option == "currentstatus"){
        $module->getCurrentStatus($dbio, $_POST["3"]);
        echo json_encode($module);
    } else if($option == "getdocs"){
        echo json_encode($module->getDocsToUpload($dbio, $_POST["3"]));
    } else if($option == "updateinr"){
        $module->updateInrValue($dbio, json_decode($_POST["3"]));
        echo json_encode($module);
    } else if($option == "downlaodcorprep" and $right->query == 1){
        $module->downloadCorpReport($dbio, json_decode($_POST["3"]), $right);
    } elseif($option == "viewloa"){
        $module->viewLOA($dbio, json_decode($_POST["3"]));
    } elseif($option == "downloadloa"){
        echo json_encode($module->downlaodLOA($dbio, json_decode($_POST["3"])));
    } elseif($option == "employeedata"){
        echo json_encode($module->getEmployeeData($dbio, $_POST["3"], $_POST["4"]));
    } elseif($option == "getfile"){
        echo json_encode($module->getFileData($dbio, json_decode($_POST["3"])));
    } elseif($option == "getcarddetails"){
        echo json_encode($module->getCardDetails($dbio, $_POST["3"]));
    } elseif($option == "resendemail"){
        echo json_encode($module->resendEmail($dbio, $_POST["3"]));
    } elseif($option=='cashfreebanklist'){ 
        echo json_encode($cashfree->getBankList($dbio));
    }elseif($option=='cashfreebanklistall'){
        echo json_encode($cashfree->getBankListAll($dbio));
    }elseif($option=='sendpaymentlink'){
        $cashfreecorp = new CashFreeCorpModule();
        echo(json_encode($cashfreecorp->sendPaymentLink($dbio,$_POST["3"])));       
    }else if($option == "leaduploadformet"){
        echo json_encode($module->getLeadUploadFormet($dbio, json_decode($_POST["3"])));
    }else if($option == "errorUploadData"){
        json_encode($module->errorUploadData($dbio,  json_decode(($_POST["3"]), true)));
    }
    else {
        echo '{"msg": "MSG0010"}';
    }
}else {
    echo '{"msg": "MSG0010"}';
}

?>