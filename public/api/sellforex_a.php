<?php
session_start();
require_once('dbio_c.php');
require_once('sellforex_c.php');
$dbio = new Dbio();
$sellForex = new Sell();
$session = $_POST['1'];
$option = $_POST['2'];
if($dbio->validateSession($session)){
    if($option == 'sell'){
        $sellForex->insertSellDetails($dbio, json_decode($_POST['3']));
        echo json_encode($sellForex);
    }elseif($option == 'forexdetails'){
        $sellForex->insertForexDetails($dbio, json_decode($_POST['3']), json_decode($_POST["4"]), $_POST["5"], $_POST["6"]);
        echo json_encode($sellForex);
    }else if($option == "insertSellDelivery"){
        $sellForex->insertSellDelivery($dbio, json_decode($_POST["3"]));
        echo json_encode($sellForex);
    }else if($option == "getAllDetails"){
        echo json_encode($sellForex->getAllSellDetails($dbio, $_POST['3'], $_POST["4"]));
    }
}else {
    echo('{"msg": "MSG0010"}'); 
}
?>