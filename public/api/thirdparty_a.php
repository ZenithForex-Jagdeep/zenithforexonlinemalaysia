<?php
session_start();
require_once("dbio_c.php");
require_once("thirdparty_c.php");
require_once("right_c.php");
$dbio = new Dbio();
$tparty = new ThirdParty();

$right = new Right();
$right->getUserNavRight($dbio, "THIRDPARTYSALES");

$session = $_POST["1"];
$option = $_POST['2'];

if($dbio->validateSession($session)){
    if($option == "savedata" and $right->query ==1){
        echo json_encode($tparty->insertSaleData($dbio, json_decode($_POST["3"])));
    } else if($option == "getalldata" and $right->query == "1"){
        echo json_encode($tparty->getAllThirdPartyData($dbio, json_decode($_POST["3"])));
    } else if($option == "getdata" and $right->query == "1"){
        echo json_encode($tparty->getPartyData($dbio));
    } else if($option == "deletesaledata" and $right->query == 1){
        $tparty->deletePartyData($dbio, $_POST["3"]);
        echo json_encode($tparty);
    } else if($option == "docdownload" and $right->query == 1){
        $tparty->downloadFormat($dbio);
    }
} else {
    echo('{"msg": "MSG0010"}');
}

?>