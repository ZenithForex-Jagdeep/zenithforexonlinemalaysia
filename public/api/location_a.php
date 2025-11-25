<?php
session_start();
require_once('dbio_c.php');
require_once('location_c.php');
$dbio = new Dbio();
$location = new Location();
$option = $_POST['1'];

if($option == 'location'){
    echo json_encode($location->getLocation($dbio));
}else if($option == "locationuser"){
    echo json_encode($location->getLocationUser($dbio));
}else if($option == "allbranches"){
    echo json_encode($location->getAllBranches($dbio));
}else if($option == "getCashreeActive"){
    $location->getCashfreeActive($dbio, $_POST["2"]);
    echo json_encode($location);
}else if($option == "getallbranches"){
    echo json_encode($location->getAllBranchAddress($dbio));
}else if($option == "bran"){
    $location->getBranchAddress($dbio, $_POST["2"]);
    echo json_encode($location);
}else if($option == "getofferlocation"){
    echo json_encode($location->getOfferActiveLoc($dbio));
}else if($option == "getlocforselect"){
    echo json_encode($location->getLocationForSearch($dbio));
}else if($option == "locbyname"){
    echo json_encode($location->getLocationIdByName($dbio, $_POST["2"]));
}else if($option == "locForModel"){
    echo json_encode($location->getLocationForModel($dbio));
}
else {
    echo "ERROR!!";
}


?>