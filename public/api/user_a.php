<?php
session_start();
require_once('dbio_c.php');
require_once("user_c.php");

$dbio = new Dbio();
$user = new User();
$session = $_POST["1"];
$option = $_POST["2"];
$dbio->validatePostRequest();

if($dbio->validateSession($session)){
    if($option == "branchallowedselect"){
        echo json_encode($user->getBranchAllowed($dbio));
    }else if($option == "ddlistjsonselect"){
        echo json_encode($user->getDDListJson($dbio));
    }
    else {
        echo ('"msg":"MSG0010"');
    }
}else {
    echo ('"msg":"MSG0010"');
}

?>