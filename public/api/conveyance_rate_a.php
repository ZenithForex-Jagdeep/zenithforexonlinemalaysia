<?php

session_start();
require_once('dbio_c.php');
// require_once('location_c.php');
require_once("right_c.php");
$dbio = new Dbio();
$conveyanceRate = new ConveyanceRate();
$right = new Right();

$session = $_POST["1"];
$option = $_POST['2'];
$right->getUserNavRight($dbio, "CONVEYANCE");

if($dbio->validateSession($session)){
    if($option == 'getConveyancerate' and $right->query == 1){
        echo json_encode($conveyanceRate->getConveyanceRate($dbio, $_POST["3"]));
    }
    
}else {
    echo '{"msg":"MSG0010"}';
}

?>

<?php

class ConveyanceRate{

    public function getConveyanceRate($dbio, $mode){
        $sql = "SELECT ccm_rate FROM conveyance_control_master WHERE ccm_type = '".$mode."' ORDER BY ccm_srno DESC ";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect($dbconn, $sql);
        if($result){
                $rate = mysqli_fetch_row($result);
        }
        $dbio->closeConn($dbconn);
        return $rate;
    }

}

?>