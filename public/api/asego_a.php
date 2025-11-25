<?php
session_start();
require_once("dbio_c.php");
require_once("asego_c.php");
$dbio = new Dbio();
$asego = new AsegoDetail();
$option = $_POST["1"];

if($option == "getcategory"){
    echo json_encode($asego->getCategory($dbio));
}else if($option == "sendotp"){
    $asego->sendOtp($dbio, json_decode($_POST["2"]));
    echo json_encode($asego);
}else if($option == "getRiderPercent"){
    $asego->getRiderPercents($dbio, $_POST["2"]);
    echo json_encode($asego);
}else if($option == "verifyotp"){
    $asego->verifyPhoneMailOtp($dbio, json_decode($_POST["2"]));
    echo json_encode($asego);
}else if($option == "getRiders"){
    $asego->getRiderDetails($dbio, $_POST["2"], $_POST["3"]);
    echo json_encode($asego);
}else if($option == "insertriders"){
    $asego->insertRiders($dbio, json_decode($_POST["2"]), json_decode($_POST["3"]));
    echo json_encode($asego);
}else if($option == "getpolicy"){
    $asego->getPolicy($dbio, $_POST["2"]);
    echo json_encode($asego);
}else if($option == "gethistory"){
    $asego->getOrderHistory($dbio, $_POST["2"]);
    echo json_encode($asego);
} else if($option == "getplans"){
    echo json_encode($asego->getPlans($dbio, $_POST["2"]));
} else if($option == "docdownload"){
    $asego->downloadDocument($dbio);
}else if($option == "uploadpolicy"){
    if($dbio->validateSession($_POST["3"])){
        $asego->uploadPolicyFile($dbio, $_POST["2"]);
        echo json_encode($asego);
    }else {
        echo('{"msg": "MSG0010"}');
    }
}else {
    echo '{"msg":"ERROR"}';
}

?>