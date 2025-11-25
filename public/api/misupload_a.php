<?php
session_start();
require_once("dbio_c.php");
require_once("misupload_c.php");
$dbio = new Dbio();
$uploadmis = new MisUpload();
$session = $_POST["1"];
$option = $_POST["2"];
if($dbio->validateSession($_POST["1"])){
    if($option=='misdetails' ){
        echo json_encode($uploadmis->getMisDetails($dbio));
    }else if($option == "getcalctcs"){
        $uploadmis->getCalculatedTcs($dbio, $_POST["3"]);
        echo json_encode($uploadmis);
    }else if($option == "checkorderno"){
        $uploadmis->checkOrderNo($dbio, json_decode($_POST["3"]));
        echo json_encode($uploadmis);
    }else if($option == "insertmis"){    
        $uploadmis->insertMisDetails($dbio, json_decode($_POST["3"]), json_decode($_POST["4"]));
        echo json_encode($uploadmis);
    }else if($option == "getleadslurce"){
        $uploadmis->getLeadType($dbio, $_POST["3"]);
        echo json_encode($uploadmis);
    }else if($option == "getmanualorderlog"){
        echo json_encode($uploadmis->getManualOrderLog($dbio, $_POST["3"]));
    }else if($option == "getorder"){
        $uploadmis->getOrderToEdit($dbio, $_POST["3"]);
        echo json_encode($uploadmis);
    }else if($option == "getisordereditable"){
        $uploadmis->getIsOrderEditable($dbio, $_POST["3"]);
        echo json_encode($uploadmis);
    }else if($option == "checkordereditable"){
        $uploadmis->checkOrderEditable($dbio, $_POST["3"]);
        echo json_encode($uploadmis);
    }else if($option == "addproduct"){
        $uploadmis->addNewProduct($dbio, json_decode($_POST["3"]));
        echo json_encode($uploadmis);
    }else if($option == "deleteProd"){
        echo json_encode($uploadmis->deleteProduct($dbio, json_decode($_POST["3"])));
    }else if($option == "deletecomment"){
        $uploadmis->deleteComment($dbio, json_decode($_POST["3"]));
        echo json_encode($uploadmis);
    }else if($option == "orderdump"){
        $uploadmis->getOrderDump($dbio, json_decode($_POST["3"]));
    }
}else {
    echo('{"msg": "MSG0010"}');
}


?>