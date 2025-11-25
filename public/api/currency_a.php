<?php
require_once('dbio_c.php');
require_once('currency_c.php');

$dbio = new Dbio();
$currency = new Currency();
$option = $_POST['1'];


if($option == "curr"){
    $currency->getCurrencyVal($dbio, $_POST["2"], $_POST['3'],$_POST['4']);
    echo json_encode($currency);

}else if($option == 'currtype'){
    $currency->getProductType($dbio, $_POST['2'], $_POST['3']);
    echo json_encode($currency);
    
}else if($option == "masterCurrency"){
    echo json_encode($currency->getMasterCurrency($dbio));
}else if($option == "ttupdate"){
    $currency->updateIsdActive($dbio, $_POST["2"], $_POST['3']);
    echo json_encode($currency);
}else if($option == "cardupdate"){
    $currency->updateCardActive($dbio, $_POST["2"], $_POST['3']);
    echo json_encode($currency);
}else if ($option == "cashupdate"){
    $currency->updateCashActive($dbio, $_POST["2"], $_POST['3']);
    echo json_encode($currency);
}else if($option == "filtercurr"){
    echo json_encode($currency->showFilteredCurrency($dbio, $_POST["2"], $_POST['3']));
}else if($option == "getoffercn"){
    echo json_encode($currency->getOfferCn($dbio));
}
else {
    echo "ERROR!!!!!";
}

?>