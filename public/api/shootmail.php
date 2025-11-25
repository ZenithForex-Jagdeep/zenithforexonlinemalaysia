<?php
session_start();
    require_once("dbio_c.php");
    require_once("mail_c.php");
    $dbio = new Dbio();
        if($dbio->validateSession($_POST["2"]) AND $_SESSION["userSrno"] == 1){
            $sql = "SELECT user_id, user_pass FROM user_login WHERE user_srno > 300 AND user_entitytype='E'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect($dbconn, $sql);
            if($result){
                while($row = mysqli_fetch_row($result)){
                    $to = $row[0];
                    $subject= "CRM Login Credentials";
                    $msg="Dear Sir ";
                    $msg=$msg."<br/><br/>Please find below login details for CRM<br/><br/>";
                    $msg = $msg."User ID: ".$row[0]."<br/>";
                    $msg = $msg."Password: ".$dbio->decryptString($row[1])."<br/>";
                    $msg = $msg."URL: https://www.zenithforexonline.com/login<br/>";
                    $msg=$msg." <br/><br/>Thanks & Regards<br/>";
                    //$cc="SIDDHARTH.DETWANI@ZENITHFOREX.COM;harendra.choudhary@zenithforex.com;jagdeep.singh@zenithforex.com";
                    $cc = '';
                    $bcc = "";
                    $toname = '';
                    $myMail = new Mymail();
                        $r = $myMail->sendMail($subject,$msg,$to,$cc,$bcc, $toname);
                        if($r==1){
                            echo "Email Sent :  Flag : ".$r.PHP_EOL;
                            echo("TO : ".$to.PHP_EOL);
                            echo("CC : ".$cc.PHP_EOL);
                            echo("BCC : ".$bcc.PHP_EOL);
                            echo("Subject : ".$subject.PHP_EOL);
                            echo("---------".PHP_EOL);
                        }else{
                            echo('Not able to send email.');
                        }
                        echo "Sleeping for 2 seconds".PHP_EOL;
                        sleep(2);
                }
            }
    }else {
        echo ("Bad Request.");
    }
    //echo json_encode($list);
?>