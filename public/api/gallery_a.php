<?php
session_start();
require_once("dbio_c.php");
require_once("gallery_c.php");
$dbio = new Dbio();
$gallery = new GalleryImg();
$option = $_POST["1"];

if($option == "getallgallery"){
    echo json_encode($gallery->getAllGallery($dbio));
}else if($option == "insertdetail"){
    $obj = json_decode($_POST["2"]);
    if($obj->operation == "A"){
        $gallery->insertGalleryPost($dbio, $obj);
        echo json_encode($gallery);
    }else {
        $gallery->updateGalleryPost($dbio, $obj);
        echo json_encode($gallery);
    }
}else if($option == "getgallerymaster"){
    echo json_encode($gallery->getGalleryMaster($dbio));
}else if($option == "getGalleryPost"){
    $gallery->getPostBySrno($dbio, $_POST["2"]);
    echo json_encode($gallery);
}else {
    echo ('{"msg": "No matching argument"}');
}

?>