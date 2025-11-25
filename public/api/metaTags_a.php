<?php
session_start();
require_once('dbio_c.php');
$dbio = new Dbio();
$meta=new MetaTags();
$session = $_POST["1"];
$option = $_POST['2'];
$dbio->writeLog($session);
$dbio->writeLog($option);
$dbio->writeLog(json_encode($_POST['3']));


if ($dbio->validateSession($session)) {
    if($option==='create'){
        echo json_encode($meta->createMetaTags($dbio,json_decode($_POST['3'])));
    }elseif($option==='edit'){
        echo json_encode($meta->editMetaTag($dbio,json_decode($_POST['3'])));
    }
} else {
    echo('{"msg": "MSG0010"}');
}

Class MetaTags{
    public $filePath='../metaTags.json';

    // Function to read the JSON file
    public function readMetaTags() {
        if (!file_exists($this->filePath)) {
            return [];
        }
        $json = file_get_contents($this->filePath);

        return json_decode($json, true) ?: [];
    }

    // Function to write to the JSON file
    public function writeMetaTags( $data) {//D:\\Zenith\\zenithforexonline.com\\
        file_put_contents(DIRPATH.'public\\metaTags.json', json_encode($data, JSON_PRETTY_PRINT));
        return file_put_contents(DIRPATH.'build\\metaTags.json', json_encode($data, JSON_PRETTY_PRINT));
    }

    // // Create a new meta tag
    // public function createMetaTag($filePath, $newData) {
    //     $metaTags = readMetaTags($filePath);
    //     // Generate a simple unique ID (for demonstration purposes)
    //     $newData['id'] = end($metaTags)['id'] + 1 ?? 1;
    //     $metaTags[] = $newData;
    //     return writeMetaTags($filePath, $metaTags);
    // }

    // Edit an existing meta tag by ID
    public function editMetaTag($dbio, $updatedData) {
        $metaTags = $this->readMetaTags($this->filePath);
        $msg="";
        $isok = false;
        foreach ($metaTags as &$tag) {
            if ($tag['id'] == $updatedData->editingId) {
                $tag['page'] = $updatedData->page ?? $tag['page'];
                $tag['title'] = $updatedData->title ?? $tag['title'];
                $tag['description'] = $updatedData->description ?? $tag['description'];
                $tag['url'] = $updatedData->url ?? $tag['url'];
                $isok = true;
                break;
            }
        }
        $dbio->writeLog(json_encode($metaTags));
        if ($isok) {
            if ($this->writeMetaTags($metaTags)) {
                $isok=true;
                $msg='Meta tag updated successfully.';
            } else {
                $isok=false;
                $msg='Failed to write to file.';
            }
        }
        return ['status' => $isok, 'msg' => $msg];
    }
}

?>
