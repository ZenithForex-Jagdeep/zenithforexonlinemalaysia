
<?php 
require_once('config.php');

$option = $_POST['1'];
if($option == 'checkLiveSetup' ){
    echo json_encode(LIVE);
}

?>