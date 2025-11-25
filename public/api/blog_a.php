<?php
session_start();
require_once("dbio_c.php");
require_once("blog_c.php");
$dbio = new Dbio();
$blog = new Blogs();
$option = $_POST["1"];

if($option == "addblogpost" or $option == "getblogs" ){ // or $option == "getpost"
    if($dbio->validateSession($_POST["2"])){
        if($option == "addblogpost"){
            $obj = json_decode($_POST["3"]);
            if($obj->operation == "E"){
                $blog->updateBlogPost($dbio, $obj);
                echo json_encode($blog);
            }else {
                $blog->addNewBlogPost($dbio, $obj);
                echo json_encode($blog);
            }   
        }elseif($option == "getblogs") {
            echo json_encode($blog->getBlogTable($dbio, $_POST["3"]));
        }elseif($option == "getpost"){
            $blog->getForFinBlog($dbio, $_POST["3"], $_POST["4"]);
            echo json_encode($blog);
        }
    } else {
        echo('{"msg": "MSG0010"}');
    }
}else if($option == "getallposts"){
    echo json_encode($blog->getAllBlogs($dbio));
}else if($option == "getpost"){
    $blog->getBlogBysrno($dbio, $_POST["3"]);
    echo json_encode($blog);
}else if($option == "getpostByTitle"){
    $blog->getpostByTitle($dbio, $_POST["3"]);
    echo json_encode($blog);
}else {
    echo '("msg":"ERROR")';
}

?>