<?php
session_start();
require_once('dbio_c.php');
require_once('rate_c.php');
$dbio = new Dbio();
$rate = new Rate();
$option = $_POST['1'];

if($option == 'getrate'){
    echo json_encode($rate->getRate($dbio, json_decode($_POST['2'])));
} else if($option == "updateinfo" and $dbio->validateSession($_POST["3"])){
    $rate->updateRate($dbio, json_decode($_POST['2']));
    echo json_encode($rate);
} else if($option == "copydata"){
    $rate->copyRateData($dbio, json_decode($_POST['2']));
    echo json_encode($rate);
} else if ($option == "copyall"){
    echo json_encode($rate->getDataToCopy($dbio, $_POST['2'], $_POST['3'], json_decode($_POST['4'])));
} else if($option == "getLiveRates"){
    echo json_encode($rate->getLiveRate($dbio, $_POST["2"]));
} else if($option == "userratelog"){
    echo json_encode($rate->insertUserRateLog($dbio, $_POST['2'], $_POST["3"]));
} else if($option == "getratelog" and $dbio->validateSession($_POST["2"])){
    echo json_encode($rate->getRateUpdateLog($dbio));
} elseif($option == "getactiveisd"){
    echo json_encode($rate->getActiveCurrencyCode($dbio, $_POST['2']));
} else if ($option == "getCardCashRate"){
    $rate->getRateAsPerLocation($dbio, json_decode($_POST["2"]));
    echo json_encode($rate); 
}else if ($option == "getCardCashRateAsPerLowestRate"){
    $rate->getCardCashRateAsPerLowestRate($dbio, json_decode($_POST["2"]));
    echo json_encode($rate); 
}else if ($option == "getCardCashRateAsPerLowestRateSell"){
    echo json_encode($rate->getCardCashMaxRateForSell($dbio, json_decode($_POST["2"])));
}
else {
    echo('{"msg": "MSG0010"}');
}
?>