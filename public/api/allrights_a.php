<?php
session_start();
require_once("dbio_c.php");
require_once("allrights_c.php");
$dbio = new Dbio();
$option = $_POST["1"];
$ar = new AllRights();
if($dbio->validateSession($_POST["3"])){
    if($option == "getright"){
        $ar->getUserRights($dbio, $_POST["2"]);
        echo json_encode($ar);
    }
}else {
    echo('{"msg": "MSG0010"}');
}
?>