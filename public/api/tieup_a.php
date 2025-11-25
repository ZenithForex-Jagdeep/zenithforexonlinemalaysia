<?php
session_start();
require_once("dbio_c.php");
require_once("tieup_c.php");
require_once("right_c.php");
$dbio = new Dbio();
$tieup = new Tieup();
$right = new Right();
$right->getUserNavRight($dbio, "TIEUP");
$session = $_POST["1"];
$option = $_POST["2"];
if($dbio->validateSession($session) and $right->query == 1){
    if($option == "insertlead"){
        $obj = json_decode($_POST["3"]);
        if($obj->optype == "A"){
            $tieup->insertTieUpLead($dbio, $obj);
        }else {
            $tieup->updateTieUpLead($dbio, $obj);
        }
        echo json_encode($tieup);
    }else if($option == "getData"){
        echo json_encode($tieup->getTieupData($dbio));
    }else if($option == "editdata"){
        $tieup->getTieUpDataBySrno($dbio, $_POST["3"]);
        echo json_encode($tieup);
    }else if($option == "getFollowupData"){
        $tieup->getFollowUpData($dbio, $_POST["3"]);
        echo json_encode($tieup);
    }else if($option == "addfollowup"){
        $tieup->insertFollowUpData($dbio, json_decode($_POST["3"]));
        echo json_encode($tieup);   
    }else if($option == "getactivity"){
        echo json_encode($tieup->getActivityLog($dbio, $_POST["3"]));
    }else if($option == "getFilterList"){
        echo json_encode($tieup->getFilterTieup($dbio, json_decode($_POST["3"])));
    }else if($option == "tieupFollowup"){
        echo json_encode($tieup->getFollowUpList($dbio));
    }
}else {
    echo '{"msg":"MSG0010"}';
}

?>