<?php
session_start();
require_once ("dbio_c.php");
require_once ("convera_c.php");
$option = $_POST["1"];
$dbio = new Dbio();
$convera = new Convera();
if ($option == "allInstitute" && CONVERAACTIVATION===1) {
    echo json_encode($convera->getInstituteListByCountry($dbio,json_decode($_POST["2"])));
}  else if ($option == "allservice") {
    echo json_encode($convera->getServiceListByClientId($dbio,json_decode($_POST["2"])));
}else if ($option == "save") {
    echo json_encode($convera->saveData($dbio,json_decode($_POST["2"])));
}else if ($option == "verifyOTP") {
    echo json_encode($convera->verifyOTP($dbio,json_decode($_POST["2"])));
}else if ($option == "updateService") {
    echo json_encode($convera->updateService($dbio,json_decode($_POST["2"])));
}else{
    echo '{"msg":"MSG0010"}';
}

?>