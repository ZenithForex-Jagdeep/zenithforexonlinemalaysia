<?php
session_start();
require_once("dbio_c.php");
require_once("dashboard_c.php");
$dbio = new Dbio();
$dash = new Dashboard();
$session = $_POST["1"];
$option = $_POST["2"];
if($dbio->validateSession($session)){
    require_once("right_c.php");
    $right = new Right();
    $right->getUserNavRight($dbio,"DASHBOARD");
    if($option == "getallotedemp" and $right->query == 1){
        $dash->getAllotedEmployee($dbio);
        echo json_encode($dash);
    } else if($option == "monthlytran" and $right->query == 1) {
        echo json_encode($dash->getDailyTransaction($dbio, json_decode($_POST["3"])));
    } else if($option == "getonedaytran" and $right->query == 1){
        echo json_encode($dash->getoneDayTransaction($dbio, json_decode($_POST["3"])));
    }
}else {
    echo '{"msg":"MSG0010"}';
}

?>