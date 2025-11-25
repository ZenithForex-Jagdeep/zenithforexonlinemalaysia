<?php
require_once('config.php');

require 'Exception.php';
require 'PHPMailer.php';
require 'SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mymail{
    public function sendMail($subject,$msg,$to,$cc,$bcc,$toname,$attachment=""){
        try {
            $mail = new PHPMailer(TRUE);
            /* Set the mail sender. */
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            $mail->setFrom(MAILFROM, MAILFROMNAME);
         
            /* Add a recipient. */
            if(strpos($to, ',')){
                $arrTo = explode(',',$to);
                foreach ($arrTo as $value) {
                    if($value!=""){
                        $mail->addAddress($value, "");    
                    }
                }
            }else if(strpos($to, ';')){
                $arrTo = explode(';',$to);
                foreach ($arrTo as $value) {
                    if($value!=""){
                        $mail->addAddress($value, "");    
                    }
                }
            }else{
                if($to!=""){
                    $mail->addAddress($to, $toname);
                }
            }
            
            if($cc!=""){
                if(strpos($cc, ',')){
                    $arrCc = explode(',',$cc);
                    foreach ($arrCc as $value) {
                        if($value!=""){
                            $mail->addCC($value, "");
                        }    
                    }
                }else if(strpos($cc, ';')){
                    $arrCc = explode(';',$cc);
                    foreach ($arrCc as $value) {
                        if($value!=""){
                            $mail->addCC($value, "");    
                        }
                    }
                }else{
                    $mail->addCC($cc, $cc);
                }
            }

            if($bcc!=""){
                if(strpos($bcc, ',')){
                    $arrBcc = explode(',',$bcc);
                    foreach ($arrBcc as $value) {
                        if($value!=""){
                            $mail->addBCC($value, "");    
                        }
                    }
                }else if(strpos($bcc, ';')){
                    $arrBcc = explode(';',$bcc);
                    foreach ($arrBcc as $value) {
                        if($value!=""){
                            $mail->addBCC($value, "");    
                        }
                    }
                }else{
                    $mail->addBCC($bcc, $bcc);
                }
            }

         
            //$mail->addBCC("himanshu.tomar@zenithforex.com", "");
            $mail->addBCC("jagdeepautomails@gmail.com", "");
            // $mail->addBCC("onlinesales1@zenithforex.com", "");

            //attachment
            if($attachment!=""){
                if(strpos($attachment, ',')){
                    $arrAttc = explode(',',$attachment);
                    foreach ($arrAttc as $value) {
                        $mail->addAttachment($value);
                    }
                }else{
                    $mail->addAttachment($attachment);
                }
            }
            /* Set the subject. */
            $mail->Subject = $subject;
         
            /* Set the mail message body. */
            //$mail->Body = 'There is a great disturbance in the Force.';
            $mail->msgHTML($msg);
            //$mail->msgHTML(file_get_contents('contents.html'), __DIR__) //Read an HTML message body from an external file, convert referenced images to embedded,
            //$mail->AltBody = 'HTML messaging not supported'; // If html emails is not supported by the receiver, show this body
            // $mail->addAttachment('images/phpmailer_mini.png'); //Attach an image file
    
            /* Tells PHPMailer to use SMTP. */
            $mail->isSMTP();
       
            /* SMTP server address. */
            $mail->Host = MAILSMTP;
    
            /* Use SMTP authentication. */
            $mail->SMTPAuth = TRUE;
       
            /* Set the encryption system. */
            $mail->SMTPSecure = MAILSMTPSECURE;
       
            /* SMTP authentication username. */
            $mail->Username = MAILUSERNAME;
       
            /* SMTP authentication password. */
            $mail->Password = MAILPASSWORD;
       
            /* Set the SMTP port. */
            $mail->Port = MAILPORT;
            
            /* Finally send the mail. */
            $resp =   $mail->send();
    
            if($resp==1){
                //echo("Mail Sent Successfully.");
                return true;
            }else{
                //echo($resp);
                return false;
            }
         }
         catch (Exception $e)
         {
            /* PHPMailer exception. */
            //echo $e->errorMessage();
            return false;
         }
         catch (\Exception $e)
         {
            /* PHP exception (note the backslash to select the global namespace Exception class). */
            //echo $e->getMessage();
            return false;
         }
    }

}

?>

