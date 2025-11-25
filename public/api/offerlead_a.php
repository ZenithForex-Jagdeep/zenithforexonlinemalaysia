<?php
require_once('dbio_c.php');
require_once('offerlead_c.php');
$dbio = new Dbio();
$lead = new OfferLead();
$option = $_POST['1'];

if($option == "verifyotp"){
    $lead->verifyOtp($dbio, json_decode($_POST["2"]));
    echo json_encode($lead);
}else if($option == 'sendOfferOtp'){
    $lead->sendOtp($dbio, json_decode($_POST["2"]));
    echo json_encode($lead);
}else {
    echo "{'msg':'No matching arguments.'}";
}


?>