<?php
require_once("dbio_c.php");
require_once("purpose_c.php");
$option = $_POST["1"];
$dbio = new Dbio();
$purpose = new GetPurpose();

if($option == "getpurpose"){
    echo json_encode($purpose->getTravelPurpose($dbio));
}else if ($option == "getdocs"){
    $purpose->getDocuments($dbio, $_POST["2"]);
    echo json_encode($purpose);
}else if ($option == "updateright"){
    $purpose->updatePurposeRight($dbio, json_decode($_POST["2"]));
    echo json_encode($purpose);
}else if($option == "insertPurpose"){
    $purpose->insertNewPurpose($dbio, json_decode($_POST["2"]));
    echo json_encode($purpose);
}else if($option == "editpurpose"){
    $purpose->editPurposeMaster($dbio, json_decode($_POST["2"]));
    echo json_encode($purpose);
}else if($option == "getTTpurpose"){
    echo json_encode($purpose->getTTPurpose($dbio));
}
else {
    echo "ERROR!!";
}

?>