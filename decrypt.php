<?php

echo "Press 1 for Decrypt\n";
echo "Press 2 for Encrypt\n";
$o = (int)readline('Enter your choice:');
$str = readline('Enter string:');

// Store the encryption key
$encryption_key ="ThisIsZenith";
 

// Store the cipher method
$ciphering= "AES-128-CTR";

    
// Use OpenSSl Encryption method
//$iv_length = openssl_cipher_iv_length($ciphering);
$options = 0;

// Non-NULL Initialization Vector for encryption
$encryption_iv= "9876543210852963";

if($o==1){
    echo "Result :   ".openssl_decrypt ($str, $ciphering,$encryption_key, $options, $encryption_iv);
}else if($o==2){
    echo "Result :   ".openssl_encrypt($str, $ciphering,$encryption_key, $options, $encryption_iv);
}else{
    echo "Wrong Choice";
}



?>