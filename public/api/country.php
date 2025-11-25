<?php
require_once('dbio_c.php');
require_once('country_c.php');
$dbio = new Dbio();
$const = new Country();
$var = $_POST["1"];

if($var == "country"){
    echo json_encode($const->getCntAndPurpose($dbio));
}else if ($var == "getbranch"){
    $const->getBranchForDelivery($dbio, $_POST['2']);
    echo json_encode($const);
}else if($var == "remitRate"){
    $const->getRemitRates($dbio, $_POST['2'], $_POST['3']);
    echo json_encode($const);
}
else {
    echo "ERROR!!";
}

?>