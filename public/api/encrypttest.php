<?php
// REFKEY = 9ea6b43b-d32d-4504-ab96-fb04cf8d3d25
require_once("dbio_c.php");
$encryptionKey = "b0af8a62-db0a-4d19-9d45-975fa4ec8e7e";

function encryptAES($plaintext, $key) {
    $method = 'AES-256-CBC';
    $iv = substr(REFKEY, 0, 16);
    $ciphertext = openssl_encrypt($plaintext, $method, $key, OPENSSL_RAW_DATA, $iv);
    return $ciphertext;
}

$string = "<policy><identity><sign>b0af8a62-db0a-4d19-9d45-975fa4ec8e7e</sign><branchsign>e13b630d-e6dc-4bb0-99fa-f6d9c9c40dd8</branchsign>
<username>Np_ZENITHFIT</username><reference>230529110826/1</reference></identity><plan><categorycode>6b123144-2e3a-490e-baeb-b59f09327b7c</categorycode>
<plancode>02eb3430-22a1-4b72-9f6a-2943b4180bb7</plancode><basecharges>966</basecharges><riders><ridercode percent='5'>3c9c9025-1f9f-4d0b-acbd-588edeadc052</ridercode>
<ridercode percent='3'>fbe495cc-525f-4c96-818c-0d68143fcc9a</ridercode></riders><totalbasecharges>966</totalbasecharges>
<servicetax>173.88</servicetax><totalcharges>1043.28</totalcharges></plan><traveldetails><departuredate>01-Jun-2023</departuredate><days>5</days>
<arrivaldate>05-Jun-2023</arrivaldate></traveldetails><passengerreference> himanshu  </passengerreference><insured><passport>NA</passport>
<contactdetails><address1>NA</address1><address2>NA</address2><city>Ahmedabad</city><district>Ahmedabad</district><state>Ahmedabad</state><pincode>560009</pincode>
<country>India</country><phoneno>8810563124</phoneno><mobileno>8810563124</mobileno><emailaddress>himanshu.tomar@zenithgodigital.com</emailaddress></contactdetails>
<name>himanshu </name><dateofbirth>20-May-2000</dateofbirth><age>23</age><trawelltagnumber></trawelltagnumber><nominee>NA</nominee><relation>NA</relation>
<pastillness>NA</pastillness></insured><otherdetails>
<policycomment>NA</policycomment><universityname>NA</universityname><universityaddress>NA</universityaddress></otherdetails></policy>";

$encr = encryptAES($string, $encryptionKey);
$data = base64_encode($encr);

$postData = array("Data"=>$data, "Ref"=>REFKEY);
$url = "https://asegotravel.in/trawelltag/v2/CreatePolicy.aspx";

function callApiPost($url, $postData){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS,  http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $server_output = curl_exec($ch);
    $dataq['content']        = curl_exec( $ch );
    $dataq['err']            = curl_errno( $ch );
    $dataq['errmsg']         = curl_error( $ch );
    $dataq['result']         = curl_getinfo( $ch );
    $dataq['http_status']    = curl_getinfo($ch, CURLINFO_HTTP_CODE);      
    curl_close ($ch);
    return $server_output;
}
    $reponse = callApiPost($url, $postData);
    echo $reponse;

?>