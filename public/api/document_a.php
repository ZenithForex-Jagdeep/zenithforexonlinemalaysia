<?php
session_start();
require_once("dbio_c.php");
require_once("document_c.php");
$document = new Documents();
$dbio = new Dbio();
$session = $_POST["1"];
$option = $_POST["2"];

if($dbio->validateSession($session)){
    if($option == "getdocsbyorderno"){
        echo json_encode($document->getDocList($dbio, $_POST["3"]));
    }else if($option == "docview"){
        $document->viewDocument($dbio, json_decode($_POST["3"]));
    }else if($option == "docdownload"){
        $document->downloadDocument($dbio, json_decode($_POST["3"]));
    }
}else {
    echo('{"msg": "MSG0010"}');
}

?>