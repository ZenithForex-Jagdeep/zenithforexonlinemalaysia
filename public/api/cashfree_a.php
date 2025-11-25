<?php
session_start();
require_once("dbio_c.php");
require_once("cashfree_c.php");
$dbio = new Dbio();
$cashfree = new CashFree();
$cashfree_asego = new Cashfree_asego();
$session = $_POST["1"];
$option = $_POST["2"];
$obj = json_decode($_POST["3"]);
if($obj->ordertype == "corp_module"){
    if($option == "corp_module"){
            echo json_encode($cashfree->paymentStatus($dbio, $obj));
        }
}else{
    if($dbio->validateSession($session)){
        if($option == "paymentverify"){
            if($obj->ordertype == "insurance"){
                echo json_encode($cashfree_asego->paymentStatus($dbio, $obj));
            }else {
                echo json_encode($cashfree->paymentStatus($dbio, $obj));
            }
        }
    }else {
        echo '{"msg": "MSG0010"}';
    }
}

?>