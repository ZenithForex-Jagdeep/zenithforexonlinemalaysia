<?php
session_start();
require_once('dbio_c.php');
require_once('master_c.php');
$dbio = new Dbio();
$master = new Master();
$session = $_POST["1"];
$option = $_POST['2'];

if($dbio->validateSession($session)){
    if($option == 'userinfo'){
        echo json_encode($master->getUserDetails($dbio, json_decode($_POST["3"])));
        
    }else if($option == 'edituserinfo'){
        $master->getUserDetailsToEdit($dbio, $_POST['3']);
        echo json_encode($master);
    }else if($option == 'updateuserdetail'){
        if($_POST['4']>0){
            $master->updateUser($dbio, json_decode($_POST['3']), $_POST['4']);
            echo json_encode($master);
        }else{
            $master->insertUser($dbio, json_decode($_POST['3']), $_POST['4']);
            echo json_encode($master);
        }
    }else if($option == 'country'){
        echo json_encode($master->getCountry($dbio));
    }else if($option == 'editcnt'){
         $master->getCnt($dbio, $_POST['3']);
         echo json_encode($master);
    }else if($option == 'savecnt'){
            $master->insertOrUupdateCnt($dbio,$_POST['3'], json_decode($_POST['4']));
            echo json_encode($master);   
    }else if($option == "getOrderLog"){
        echo json_encode($master->getOrderLog($dbio, json_decode($_POST["3"])));
    }else if($option == "getoptionfilter"){
        echo json_encode($master->getFilterOption($dbio));
    }else if($option == "getuserbranchlink"){
        echo json_encode($master->getUserBranchLink($dbio, $_POST["3"], $_POST["4"]));
    }else if($option == "changeRight"){
        $master->changeRight($dbio, json_decode($_POST["3"]));
        echo json_encode($master);
    }else if($option == "getBranchByCode"){
        $master->getBranchByCode($dbio, $_POST["3"]);
        echo json_encode($master);
    }else if($option == "updateMasterLoc"){
        $master->updateMasterLocation($dbio, json_decode($_POST["3"]));
        echo json_encode($master);
    }else if($option == "updateStatus"){
        $master->updateOrderStatus($dbio, json_decode($_POST["3"]));
        echo json_encode($master);
    }else if($option == "getlog"){
        echo json_encode($master->getActivityLog($dbio, $_POST["3"]));
    }else if($option == "updateremark"){
        echo json_encode($master->insertRemark($dbio, json_decode($_POST["3"])));
    }else if($option == "getdoclist"){
        echo json_encode($master->getDocLists($dbio));
    }else if($option == "addDoc"){
        $master->insertDoc($dbio, $_POST["3"]);
        echo json_encode($master);
    }else if($option == "editDoc"){
        $master->updateDoc($dbio, $_POST["3"], $_POST["4"]);
        echo json_encode($master);
    }else if($option == "getemployee"){
        echo json_encode($master->getEmployee($dbio));
    }else if($option == "insertemp"){
        $obj = json_decode($_POST["3"]);
        if($obj->scrMode == "A"){
            $master->insertEmployee($dbio, json_decode($_POST["3"]));
        }else {
            $master->updateEmployee($dbio, json_decode($_POST["3"]));
        }
        echo json_encode($master);
    }else if($option == "getempbysrno"){
        $master->getEmployeeBySrno($dbio, $_POST["3"]);
        echo json_encode($master);
    }else if($option == "addreporting"){
        $master->addReporting($dbio, json_decode($_POST["3"]));
        echo json_encode($master);
    }else if($option == "getreportinglist"){
        echo json_encode($master->getReportingList($dbio, $_POST["3"]));
    }else if($option == "deleteemplink"){
        $master->deleteReporting($dbio, $_POST["3"], $_POST["4"]);
        echo json_encode($master);
    }else if($option == "thirdpartylist"){
        echo json_encode($master->getThirdPartyList($dbio, json_decode($_POST["3"])));
    } else if($option == "savethirdpartydata"){
        $obj = json_decode($_POST["3"]);
        if($obj->srno*1 > 0){
            $master->updateThirdPartyData($dbio, $obj);
        }else {
            $master->insertThirdPartyData($dbio, $obj);
        }
        echo json_encode($master);
    }else if($option == "datatoedit"){
        $master->getThirdPartyDataBySrno($dbio, $_POST["3"]);
        echo json_encode($master);
    }else if($option == "getEmpList"){
        echo json_encode($master->getEmpList($dbio));
    }else if($option == "isd"){
        echo json_encode($master->getFilterISD($dbio));
    }else if($option == "corpList"){
        echo json_encode($master->getCorporateList($dbio));
    }
}else {
    echo('{"msg": "MSG0010"}');
}


?>