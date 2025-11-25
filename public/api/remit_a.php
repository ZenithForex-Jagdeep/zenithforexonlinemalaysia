<?php
session_start();
require_once('dbio_c.php');
require_once('remit_c.php');
$dbio = new Dbio();
$remit = new Remit();
$option = $_POST['1'];

if($option == 'remit' and $dbio->validateSession($_POST["3"])){
     $remit->insertRemitDetails($dbio, json_decode($_POST['2']));
     echo json_encode($remit);
}else if($option == 'senderDetail'){
    $remit->insertSenderDetails($dbio, json_decode($_POST['2']), $_POST["3"]);
    echo json_encode($remit);
}else if($option == 'beneficiary'){
    $remit->insertBeneficiaryDetails($dbio, json_decode($_POST['2']), $_POST["3"]);
    echo json_encode($remit);
}else if($option == 'processOrder'){
    $remit->insertProcessDetails($dbio, json_decode($_POST['2']), $_POST["3"]);
    echo json_encode($remit);
}else if($option == 'getAllDetails'){
    echo json_encode($remit->getAllInfo($dbio, $_POST['2']));
}
else {
    echo('{"msg": "MSG0010"}');
}
?>