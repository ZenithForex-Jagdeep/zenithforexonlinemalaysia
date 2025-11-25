<?php
session_start();
require_once("dbio_c.php");
require_once("right_c.php");
$dbio = new Dbio();
$right = new Right();
$option = $_POST["1"];

if($option == "getrgtgrp"){
    echo json_encode($right->getRightGroup($dbio));
}else if($option == "getAllRight"){
    echo json_encode($right->getAllRights($dbio));
}else if ($option == "details"){
    $right->getDetail($dbio, $_POST["2"]);
    echo json_encode($right);
}else if($option == "getrightdetail"){
    echo json_encode($right->getRightDetails($dbio, $_POST["2"]));
}else if ($option == "getRight"){
    echo json_encode($right->getRights($dbio));
}else if($option == "changeright"){
    $right->changeRight($dbio, json_decode($_POST["2"]));
    echo json_encode($right);
}else if($option == "save"){
    $right->saveNewRight($dbio, json_decode($_POST["2"]));
    echo json_encode($right);
}
else {
    echo "{'msg':'No Matching Arguments'}";
}

?>