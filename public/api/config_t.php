<?php
$cashfreeLive = false;
if($cashfreeLive){
    //live 
    define("A_CASHFREE_RETURN_URL","https://www.zenithforexonline.com/cf/{order_id}");   // live
    define("A_CASHFREE_NOTIFY_URL","https://www.zenithforexonline.com/api/notify.php");        // live
    define("A_CASHFREE_APPID","21716367f11198b16ff94d0205361712"); 
    define("A_CASHFREE_SECRETKEY","4f75a38447db71d1161dbc35ffd43359772a234a"); 
    define("A_CASHFREE_CREATE_ORDER","https://api.cashfree.com/pg/orders");  
    define("A_CASHFREE_PAYMENT_CHECK","https://api.cashfree.com/pg/orders/");
}else{
    //test
    define("A_CASHFREE_RETURN_URL","http://localhost:8005/cf/{order_id}"); // test
    define("A_CASHFREE_NOTIFY_URL","http://localhost:8005/api/notify_a.php");  // test
    define("A_CASHFREE_APPID","1686205222c22c3bdfe6aa8555026861"); 
    define("A_CASHFREE_SECRETKEY","35a6d73139b319362c5dcfe13e2f1f9890df90db"); 
    define("A_CASHFREE_CREATE_ORDER","https://sandbox.cashfree.com/pg/orders");  
    define("A_CASHFREE_PAYMENT_CHECK","https://sandbox.cashfree.com/pg/orders/");
}

?>