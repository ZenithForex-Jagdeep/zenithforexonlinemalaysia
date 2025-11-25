<?php
session_start();
require_once('dbio_c.php');
require_once('conveyance_c.php');
require_once("right_c.php");
$dbio = new Dbio();
$conveyance = new Conveyance();
$right = new Right();
$session = $_POST["1"];
$option = $_POST["2"];
$right->getUserNavRight($dbio, "CONVEYANCE");

if($dbio->validateSession($session)){
    if($option == 'getList' and $right->query == 1){
        echo json_encode($conveyance->getConveyanceList($dbio, json_decode($_POST["3"])));
    }else if($option == 'submitConveyance'){
        if($_POST["3"] > 0 and $right->add == 1){
            echo json_encode($conveyance->updateConveyanceData($dbio, json_decode($_POST["4"])));
        }else if($right->edit == 1){
            echo json_encode($conveyance->submitConveyanceData($dbio, json_decode($_POST["4"])));
        }
    //  and $right->add == 1){
    }else if($option == 'deleteConveyance' and $right->edit == 1){
        echo json_encode($conveyance->deleteConveyanceData($dbio, json_decode($_POST["3"])));
    }else if($option == "editForm" and ($right->edit == 1 or $right->query == 1)){
        $conveyance->editFormData($dbio, json_decode($_POST["3"]));
        echo json_encode($conveyance);
    }else if($option == "approval1" and $right->query == 1){
        echo json_encode($conveyance->approvedConveyanceData($dbio, json_decode($_POST["3"])));
    }else if($option == "deleteDoc" and $right->query == 1){
        echo json_encode($conveyance->deleteConveyanceDocs($dbio, json_decode($_POST["3"])));
    }else if($option == "rejectConveyance" and $right->query == 1){
        echo json_encode($conveyance->rejectedConveyance($dbio, json_decode($_POST["3"])));
    }
    // else if($option == "getEmpcode" and $right->query == 1){
    //     echo json_encode($conveyance->getEmpCode($dbio, json_decode($_POST["3"])));
    // }
}else{
    echo '{"msg":"MSG0010"}';
}


?>