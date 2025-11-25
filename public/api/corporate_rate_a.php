<?php
session_start();
require_once('dbio_c.php');
require_once('corporate_rate_c.php');
$dbio = new Dbio();
$corporate = new Corporate();
$session = $_POST["1"];
$option = $_POST['2'];

if($dbio->validateSession($session)){
    if($option == 'list'){
        echo json_encode($corporate->getCorporateRatesList($dbio, json_decode($_POST["3"])));
    }else if($option == 'inserteditcorporaterate'){
        echo json_encode($corporate->insertEditCorporateRate($dbio, json_decode($_POST["3"])));
        // echo json_encode($corporate);
    }else if($option == 'getcorporateratebysrno'){
        echo json_encode($corporate->getCorporateRateBySrno($dbio, $_POST["3"]));
    }else if($option == 'deletecorporaterate'){//not in use.
        $corporate->deleteCorporateRate($dbio, $_POST["3"]);
        echo json_encode($corporate);
    }else if($option == 'getisdrate'){
        echo json_encode($corporate->getCorporateRateByIsd($dbio, json_decode($_POST["3"])));
    }else if($option == 'CORPORATERATERIGHT'){
        echo json_encode($corporate->getCorporateRateRight($dbio, json_decode($_POST["3"])));
    }else if($option == 'CORPORATERATECARDLIST'){
        echo json_encode($corporate->getCorporateRateCardList($dbio, json_decode($_POST["3"])));
    }
}else {
    echo('{"msg": "MSG0010"}');
}

?>
