<?php

require_once('dbio_c.php');

    // function readMetaTags() {
        $dbio = new Dbio();
        $filePath = '../metaTags.json';
        // if (!file_exists($filePath)) {
        //     return [];
        // }
        // $json = file_get_contents($filePath);
        // $dbio->writeLog("json");
        echo json_encode(file_exists($filePath));
        // echo $json;
        // return json_decode($json, true) ?: [];
    // }

// readMetaTags();


?>