<?php 
session_start();
require_once('dbio_c.php');
require_once('report_c.php');

$dbio = new Dbio();
$sessionId = $_POST["1"];
$reqObject = json_decode($_POST["2"]);

if($dbio->validateSession($sessionId)){
    require_once('right_c.php');

    $right = new Right();
    $right->getUserNavRight($dbio,$reqObject->right);
    
    if($reqObject->right=='REPLEADSTATUS' and $right->query==1){
        $filename = $dbio->getRandomString(8).".xls";
        $reqObject->filename = $filename;
        $rep = new RepLeadStatus(); 
        if($reqObject->type=='B'){
            $rep->genReportBranch($dbio,$reqObject);
        }
        if($reqObject->type=='S'){
            $rep->genReportSource($dbio,$reqObject);
        }
    }else if($reqObject->right=='REPTIEUPSTATUS' and $right->query==1){
        $filename = $dbio->getRandomString(8).".xls";
        $reqObject->filename = $filename;
        $rep = new RepTieupStatus(); 
        $rep->genReport($dbio,$reqObject);
    }else if($reqObject->right=='REPNEXTFOLLOWUP' and $right->query==1){
        $filename = $dbio->getRandomString(8).".xls";
        $reqObject->filename = $filename;
        $rep = new RepNextFollowUp(); 
        $rep->genReport($dbio,$reqObject);
    }else if($reqObject->right=='DASHBOARD' and $right->query==1){
        $rep = new RepDashboard(); 
        $rep->genReport($dbio,$reqObject);
    }else{
        echo('{"status": "MSG0003"}');    
    }    
}else{
    echo('{"msg": "MSG0010"}');
}
?>