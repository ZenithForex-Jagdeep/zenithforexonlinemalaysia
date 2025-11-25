<?php
session_start();
require_once('dbio_c.php');
require_once("user_c.php");

$dbio = new Dbio();
$user = new User();
$option = $_POST["1"];
$dbio->validatePostRequest();

if($option == "validate"){
    $user->validateLogin($dbio, $_POST["2"], $_POST["3"], $_POST["4"]);
    echo (json_encode($user));
}else if($option == "checkuserifexist"){
    $user->checkUserIfExist($dbio, json_decode($_POST["2"]));
    echo (json_encode($user));
}elseif ($option == "register"){
    $user->register($dbio, $_POST["2"], $_POST["3"], $_POST["4"], $_POST["5"], $_POST["6"], $_POST["7"]);
    echo (json_encode($user));
}elseif ($option == "otp"){
    $user->verifyOtp($dbio, $_POST["2"], $_POST["3"]);
    echo (json_encode($user));
}else if($option == 'otptime'){
    $user->checkOtpTime($dbio, $_POST['2']);
    echo json_encode($user);
}elseif($option == "reset"){
    $user->resetPass($dbio, $_POST["2"]);
    echo (json_encode($user));
}elseif($option == "changePass"){
    $user->changePass($dbio, $_POST["2"], $_POST["3"], $_POST["4"], $_POST["5"]);
    echo (json_encode($user));
}elseif ($option == "checkMobile") {
    $user->checkMobileNumber($dbio, $_POST["2"]);
    echo (json_encode($user));
}elseif($option == "checkotp"){
    $user->checkLoginOtp($dbio, $_POST["2"], $_POST["3"]);
    echo (json_encode($user));
}elseif($option == "signout"){
    $user->validateSignout($dbio);
    echo (json_encode($user));
}else if($option == 'phoneotp'){
    $user->checkPhoneOtp($dbio, $_POST['2'], $_POST['3']);
    echo json_encode($user);
}else if($option == 'emailotp'){
    $user->checkEmailOtp($dbio, $_POST['2'], $_POST['3']);
    echo json_encode($user);
}else if($option == 'profile'){
    $user->getCurrentUser($dbio);
    echo json_encode($user);
}else if($option == 'verifyemail'){
    $user->verifyMail($dbio, $_POST['2']);
    echo json_encode($user);
}else if($option == 'verifyProfileOtp'){
    $user->verifyProfileEmailOtp($dbio, $_POST['2']);
    echo json_encode($user);
}
else {
    echo "ERROR!";
}



?>