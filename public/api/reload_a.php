<?php
session_start();
require_once("dbio_c.php");
require_once("reload_c.php");
$dbio = new Dbio();
$reload = new ReloadForex();
$option = $_POST["1"];

if($option == "reload" and $dbio->validateSession($_POST["3"])){
    $reload->insertReloadDetails($dbio, json_decode($_POST["2"]));
    echo json_encode($reload);
}else if($option == "getpurpose"){
    $reload->getPurposeDetails($dbio);
    echo json_encode($reload);
}else if($option == "insertTravelDetail"){
    $reload->insertTraveldetail($dbio, json_decode($_POST["2"]));
    echo json_encode($reload);
}else if($option == "getforex" and $dbio->validateSession($_POST["3"])){
    $reload->getForexDetails($dbio, $_POST["2"]);
    echo json_encode($reload);
}else if($option == "getAllInfo"){
    echo json_encode($reload->getAllDetails($dbio, $_POST['2']));
}else if ($option == "sendmail"){
    $reload->sendOrderPlaceEmail($dbio, $_POST["2"]);
    echo json_encode($reload);
}else if($option == "insertaccdetails"){
    $reload->insertAccDetails($dbio, json_decode($_POST["2"]));
    echo json_encode($reload);
}
else {
    echo('{"msg": "MSG0010"}');
}


?>