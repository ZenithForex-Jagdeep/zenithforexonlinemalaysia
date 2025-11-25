<?php
session_start();
require_once ('dbio_c.php');
require_once ('buyforex_c.php');
$dbio = new Dbio();
$buyforex = new Buyforex();
$option = $_POST["1"];


if ($option == "buy" and $dbio->validateSession($_POST["4"])) {
    $buyforex->buyOrder($dbio, $_POST['2'], json_decode($_POST['3']));
    // echo json_encode($buyforex);
    echo json_encode($buyforex);
} else if ($option == 'leadheader' and $dbio->validateSession($_POST["3"])) {
    $buyforex->submitLeadHeader($dbio, json_decode($_POST['2']));
    echo json_encode($buyforex);
} else if ($option == "back") {
    $buyforex->clickBack($dbio, $_POST['2']);
    echo json_encode($buyforex);
} else if ($option == 'getDetails') {
    $obj = isset($_POST['3']) ? json_decode($_POST['3']) : null;
    $buyforex->getBuyDetails($dbio, $_POST['2'],$obj);
    echo json_encode($buyforex);
} else if ($option == "get_po_details" and $dbio->validateSession($_POST["3"])) {
    echo json_encode($buyforex->getPOdetails($dbio, $_POST['2']));
} else if ($option == 'addforexdetails') {
    $buyforex->addForexDetail($dbio, json_decode($_POST['2']), $_POST['3'], $_POST['4'], $_POST['5']);
    echo json_encode($buyforex);
} else if ($option == "timeexceed") {
    $buyforex->timeLimit($dbio);
    echo json_encode($buyforex);
} else if ($option == "upadteFields") {
    $buyforex->updatePlaceOrder($dbio, json_decode($_POST['2']));
    echo json_encode($buyforex);
} else if ($option == 'deliveryDetails') {
    $buyforex->insertDeliveryDetails($dbio, json_decode($_POST['2']));
    echo json_encode($buyforex);
} else if ($option == "getAll") {
    echo json_encode($buyforex->getAllDetails($dbio, $_POST['2']));

} else if ($option == 'getdocs') {
    echo json_encode($buyforex->getDocuments($dbio, $_POST['2'], $_POST['3']));

} else if ($option == "getbankname") {
    echo json_encode($buyforex->getActiveBankName($dbio));
} else if ($option === "placedorderdetail") {
    echo json_encode($buyforex->getOrderHistory($dbio, json_decode($_POST["2"])));
} else if ($option == "getUserHistory") {
    echo json_encode($buyforex->getBuyHistory($dbio, $_POST["2"]));
} else if ($option == "getFinalOrder") {
    $buyforex->getFinalOrderDetails($dbio, $_POST['2']);
    echo json_encode($buyforex);
} else if ($option == "sendmail") {
    $obj = json_decode($_POST["2"]);
    if ($dbio->validateSession($obj->sid)) {
        $buyforex->sendOrderMail($dbio, json_decode($_POST["2"]));
        echo json_encode($buyforex);
    } else {
        echo ('{"msg": "MSG0010"}');
    }
} else if ($option == "getbankdetails") {
    $buyforex->getBankDetails($dbio, $_POST["2"]);
    echo json_encode($buyforex);
} else if ($option == "getDetailsPaytm") {
    echo json_encode($buyforex->getDetailsForPaytmGateway($dbio, $_POST["2"]));

} else if ($option == "getUsdRate") {
    $buyforex->getUsdRate($dbio, $_POST["2"]);
    echo json_encode($buyforex);
} else if($option == "getTcs"){
    $obj = json_decode($_POST['2']);
    echo json_encode($buyforex->calculateTcs($dbio, $obj->tcsinfo->pan, $obj->totalamount, $obj->tcsinfo->purpose, $obj->educationLoan));
}
else {
    echo ('{"msg": "MSG0010"}');
}

?>