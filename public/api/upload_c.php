<?php

require 'vendoroffice/autoload.php';
require_once( 'right_c.php' );

class FileUpload {

    private function callApiPost( $url, $postData ) {
        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_URL, $url );
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array( 'Content-Type: application/x-www-form-urlencoded' ) );
        curl_setopt( $ch, CURLOPT_POST, 1 );
        curl_setopt( $ch, CURLOPT_POSTFIELDS,  http_build_query( $postData ) );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        $server_output = curl_exec( $ch );
        $dataq[ 'content' ]        = $server_output;
        $dataq[ 'err' ]            = curl_errno( $ch );
        $dataq[ 'errmsg' ]         = curl_error( $ch );
        $dataq[ 'result' ]         = curl_getinfo( $ch );
        $dataq[ 'http_status' ]    = curl_getinfo( $ch, CURLINFO_HTTP_CODE );

        curl_close ( $ch );
        return $server_output;
    }

    public $msg;

    public function uploadConveyanceDocs( $dbio, $requestObject ) {

        // $url = 'http://localhost:1005/api/conveyance_docs_a.php';
        // $postData = array( 'obj'=>$requestObject );
        // $this->callApiPost( $url, $postData );

        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {
            $rndstr = $dbio->getRandomString( 10 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            if ( $requestObject->srno == 0 ) {

                $target_file = TEMPPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
                move_uploaded_file( $temp_name, $target_file );
                $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            } else {

                $target_file = UPLOADDOCSPATH.'CONV_'.$requestObject->srno.'_'.$requestObject->uniqueKey.'.'.$ext;
                move_uploaded_file( $temp_name, $target_file );
                $new_filename = 'CONV_'.$requestObject->srno.'_'.$requestObject->uniqueKey.'.'.$ext;
            }
            $r_message = $fileName.' Upload Successfully';

            if ( $requestObject->srno == 0 ) {

                $sql = 'INSERT INTO conveyance_document_temp (cdt_line_no, cdt_srno, cdt_filename, cdt_doc_ext, cdt_user, cdt_date, cdt_random_number, cdt_doc_desc) SELECT (SELECT COALESCE(MAX(cdt_line_no), 0) + 1 FROM conveyance_document_temp), '.$requestObject->srno.", '".$r_filename."', '".$ext."', ".$_SESSION[ 'userSrno' ].", NOW(), '".$requestObject->uniqueKey."', '".$requestObject->docDesc."' ";
            } else {

                // $temppath = TEMPPATH.$uploadDocs[ $i ]->cdt_filename;
                // $r_filename = 'CONV_'.$requestObject->srno.'_'.$dbio->getRandomString( 8 ).'.'.$ext;
                // $uploadpath = UPLOADDOCSPATH.$r_filename;

                $sql = 'INSERT INTO conveyance_document (cd_line_no, cd_srno, cd_filename, cd_doc_ext, cd_user, cd_date, cd_random_number, cd_doc_desc) SELECT (SELECT COALESCE(MAX(cd_line_no), 0) + 1 FROM conveyance_document WHERE cd_srno = '.$requestObject->srno.'), '.$requestObject->srno.", '".$new_filename."', '".$ext."', ".$_SESSION[ 'userSrno' ].", NOW(), '".$requestObject->uniqueKey."', '".$requestObject->docDesc."' ";
            }
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect( $dbconn, $sql );
            if ( $result ) {
                if ( $requestObject->srno == 0 ) {

                    $sql1 = "SELECT cdt_srno, cdt_doc_ext, cdt_filename, cdt_random_number, cdt_doc_desc, cdt_line_no FROM conveyance_document_temp WHERE cdt_random_number = '".$requestObject->uniqueKey."' ";
                } else {
                    $sql1 = "SELECT cd_srno, cd_doc_ext, cd_filename, cd_random_number, cd_doc_desc, cd_line_no FROM conveyance_document WHERE cd_random_number = '".$requestObject->uniqueKey."' ";
                }
                $res = $dbio->getSelect( $dbconn, $sql1 );
            }
            if ( $res ) {
                while( $row = mysqli_fetch_assoc( $res ) ) {
                    $r_docdetail[] = $row;
                }
            }
            $dbio->closeConn( $dbconn );
            $this->msg = $r_message;

            $this->docdetail = $r_docdetail;
        }
    }

    public function uploadDocument( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {
            $rndstr = 'S'.$requestObject->docid.'_'.$requestObject->orderno.'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADDOCSPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $sql = 'DELETE FROM lead_req_document WHERE doc_id = '.$requestObject->docid." AND doc_orderno = '".$requestObject->orderno."';
            INSERT INTO lead_req_document(doc_orderno, doc_name, doc_id, doc_filename, doc_ext, doc_uploadedat)
            VALUES ('".$requestObject->orderno."', '".$requestObject->uploadType."', ".$requestObject->docid.", '".$r_filename."', '".$ext."', now());";
            $sql .= "UPDATE corp_leads SET cl_status = CASE WHEN cl_status IN (1, 3) THEN 4 ELSE cl_status END where cl_orderno = '".$requestObject->orderno."' ; ";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries( $dbconn, $sql );
            $dbio->closeConn( $dbconn );
            $this->msg = $r_message;
        }
    }

    public function uploadCheque( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {

            $rndstr = 'CHEQUE'.$requestObject->docid.'_'.$requestObject->orderno.'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $sql = "UPDATE master_account_details SET ac_bankcheque = '".$r_filename."' WHERE ac_orderno = '".$requestObject->orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect( $dbconn, $sql );
            $dbio->closeConn( $dbconn );
            $this->msg = $r_message;
        }
    }

    public function uploadCard( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {

            $rndstr = 'CARD'.$requestObject->docid.'_'.$requestObject->orderno.'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $sql = "UPDATE reload_travel SET rt_cardimg = '".$r_filename."' WHERE rt_orderno = '".$requestObject->orderno."'";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect( $dbconn, $sql );
            $dbio->closeConn( $dbconn );
            $this->msg = $r_message;
        }
    }

    public function uplodaGalleryPost( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {

            $rndstr = 'GALLERY'.$requestObject->srno.'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            $build_target_file = UPLOADPATHTOBUILD.str_replace( '/', '-', $rndstr ).'.'.$ext;
            copy( $temp_name, $build_target_file );
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $sql = "UPDATE tran_gallery SET tg_photopath = '".$r_filename."' WHERE tg_srno = ".$requestObject->srno.'';
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect( $dbconn, $sql );
            $dbio->closeConn( $dbconn );
            $this->msg = $r_message;
        }
    }

    public function uploadBlogPost( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {

            $rndstr = 'BLOG'.$requestObject->srno.'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            if ( $requestObject->src == 'ZFX' ) {
                $target_file = UPLOADPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
                $build_target_file = UPLOADPATHTOBUILD.str_replace( '/', '-', $rndstr ).'.'.$ext;
            } else {
                $target_file = FINUPLOADPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
                $build_target_file = FINUPLOADPATHTOBUILD.str_replace( '/', '-', $rndstr ).'.'.$ext;
            }
            copy( $temp_name, $build_target_file );
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $sql = "UPDATE tran_blogposts SET bl_posturl = '".$r_filename."' WHERE bl_srno = ".$requestObject->srno.'';
            if ( $requestObject->src == 'ZFX' ) {
                $dbconn = $dbio->getConn();
            } else {
                $dbconn = $dbio->getConnFin();
            }
            $result = $dbio->getSelect( $dbconn, $sql );
            $dbio->closeConn( $dbconn );
            $this->msg = $r_message;
        }
    }

    public function uploadCareerResume( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {

            $rndstr = 'CAREERRESUME'.$requestObject->srno.'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            $build_target_file = UPLOADPATHTOBUILD.str_replace( '/', '-', $rndstr ).'.'.$ext;

            copy( $temp_name, $build_target_file );
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $requestObject->cname = strtoupper( $requestObject->cname );

            $requestObject->interviewDate = $requestObject->interviewDate == ''? 'null':$requestObject->interviewDate;
            $sql = "INSERT INTO master_career_lead (mcl_srno, mcl_name, 
                mcl_jobno, mcl_email, mcl_mobile, mcl_resume, mcl_timestamp, mcl_ext, 
                mcl_status, mcl_type, mcl_feedback,mcl_shortlistusersrno, mcl_interviewschdlusersrno, mcl_interviewschdldate, mcl_interview_place, mcl_shortlisttimestamp, mcl_reject_date)
                select (SELECT COALESCE(MAX(mcl_srno), 0) FROM master_career_lead) +1, '".$requestObject->cname."', ".$requestObject->jobno."
                , '".$requestObject->cemail."', '".$requestObject->cmobile."', '".$r_filename."', now(), '".$ext."', ".$requestObject->status.", '".$requestObject->type."' ";

            if ( $requestObject->status == 3 or $requestObject->status == 7 )
            $sql .= ", '', 0, ".$_SESSION[ 'userHRsrno' ].", date(now()), '".$requestObject->interviewPlace."', null, null ";
            else if ( $requestObject->status == 1 )
            $sql .= ", '', ".$_SESSION[ 'userHRsrno' ].",0 , null, '', now(), null ";
            else if ( $requestObject->status == 4 or $requestObject->status == 6 )
            $sql .= ", '".$requestObject->feedback."', 0 ,0 , null, '', null, now() ";

            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect( $dbconn, $sql );
            if ( $result ) {
                $qry = 'SELECT MAX(mcl_srno) FROM master_career_lead';
                $res = $dbio->getSelect( $dbconn, $qry );
                if ( mysqli_num_rows( $res )>0 ) {
                    $row1 = mysqli_fetch_row( $res );
                    if ( $requestObject->type == 'A' ) {
                        $m = $this->sendCareerMail( $dbio, $row1, $requestObject );
                        if ( $m ) {
                            $r_error = '';
                            $r_message = 'Your Application has been Submitted.';
                        } else {
                            $r_error = 'Unexpected error occured. Please contact to administrator.';
                            $r_message = 'Unexpected error occured. Please contact to administrator.';
                        }
                    } else {
                        $r_error = '';
                        $r_message = 'Application has been added.';
                    }
                }
            } else {
                $r_error = 'Unexpected error occured. Please contact to administrator.';
                $r_message = 'Unexpected error occured. Please contact to administrator.';
            }
            $dbio->closeConn( $dbconn );
            return array( 'err'=>$r_error, 'msg'=>$r_message );
        }
    }

    private function sendCareerMail( $dbio, $row1, $obj ) {
        $curtime = date( 'd-m-Y H:i:s' );
        $email = 'himanshu.tomar@zenithgodigital.com';
        $qry = "SELECT mcl_srno, mcl_resume, mj_jobname FROM master_career_lead
        LEFT OUTER JOIN master_jobrole ON mcl_jobno = mj_jobno
        WHERE mcl_srno = ".$row1[ 0 ].'';
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect( $dbconn, $qry );
        $row = mysqli_fetch_row( $res );
        $dbio->closeConn( $dbconn );
        $ml = '<html>';
        $ml = $ml.'<body>';
        $ml = $ml."Job Application from zenithglobal.com.my/career <br>
            Name: ".$obj->cname." <br> 
            Email: ".$obj->cemail." <br> 
            Phone: ".$obj->cmobile." <br> 
            Profile: ".$row[ 2 ]." <br>
            <b>Thanks & Regards <br> Administrator </b>";
        $ml = $ml.'</body>';
        $ml = $ml.'</html>';
        require_once( 'mail_c.php' );

        $m = new Mymail();
        $msent = $m->sendMail( 'Job Application for  '.$row[ 2 ].' '.$curtime.'', $ml, $email, '', '', '' );
        $msent = true;
        return $msent;
    }

    public function uploadTieupDoc( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {

            $rndstr = 'TIEUPCARD'.$requestObject->srno.'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADDOCSPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            //$build_target_file = UPLOADDOCSPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $sql = "UPDATE tieup_lead SET tl_visitingcard = '".$r_filename."', tl_cardext='".$ext."' WHERE tl_srno = ".$requestObject->srno.'';
            $dbconn = $dbio->getConn();

            $result = $dbio->getSelect( $dbconn, $sql );
            $dbio->closeConn( $dbconn );
        }

    }

    public function uploadLeadData( $dbio, $requestObject ) {
        $leadsrc = $requestObject->leadsource;
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $err_isd = '';
        $err_branch = '';
        $err_line_no = 0;
        $err_orderno = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {
            if ( $leadsrc == '4' ) {
                $rndstr = 'BMF_'.$requestObject->srno.'_'.$dbio->getRandomString( 8 );
            } else {
                $rndstr = 'EXTR_'.$requestObject->srno.'_'.$dbio->getRandomString( 8 );
            }
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADDOCSPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $this->message = $r_message;

            require 'vendoroffice/autoload.php';
            $inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify( $target_file );

            if ( $inputFileType == 'Xls' ) $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
            else $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();

            $spreadsheet = $reader->load( $target_file );
            $sheet = $spreadsheet->getSheet( 0 );
            $highestRow = $sheet->getHighestRow();
            $datalist = array();

            $isOk = true;
            $ordernoArr = array();
            $isRepeated = 0;
            $qry = '';
            $qry_1 = '';
            $qry_2 = '';
            $qry_3 = '';
            $qry_4 = '';
            $qry_5 = '';
            $qry_6 = '';

            $dbconn = $dbio->getConn();
            for ( $i = 2; $i <= $highestRow; $i++ ) {
                // looping for every row that exist in excel.
                if ( $leadsrc == '4' ) {
                    for ( $x = 2; $x <= 13; $x++ ) {
                        // looping for each column in a row that exist in excel.
                        $datalist[ 'C'.$x ] =  $sheet->getCellByColumnAndRow( $x, $i )->getValue();
                    }
                    $branName = str_replace( 'Zenith Leisure Holidays-', '', $datalist[ 'C2' ] );
                    $branchCode = $this->getBranchCode( $dbio, $dbconn, $branName );
                    // to get location_code from location_name if exist, otherwise will throw error.
                    $orderno = $datalist[ 'C3' ];
                    $isd = $datalist[ 'C4' ];
                    $isdcode = $datalist[ 'C5' ];
                    $product = $datalist[ 'C6' ] == 'Currency Notes'? 'CN':'';
                    $amount = $datalist[ 'C7' ];
                    $custrate = $datalist[ 'C8' ];
                    $ibr = $datalist[ 'C9' ];
                    $settlerate = $datalist[ 'C10' ];
                    $ordertype = $datalist[ 'C11' ] == 'Buy'? 'buy':'sell';
                    $custname = $datalist[ 'C13' ];
                    $forexinr = $amount*$custrate;
                    if ( $ordertype == 'sell' ) $profit = 0;
                    else $profit = round( ( ( $custrate*$amount ) - ( $settlerate*$amount ) ), 2 );
                    $status = 1;
                } else {
                    for ( $x = 1; $x <= 12; $x++ ) {
                        $datalist[ 'C'.$x ] =  $sheet->getCellByColumnAndRow( $x, $i )->getValue();
                    }
                    $branName = explode( ', ', $datalist[ 'C4' ] );
                    $branchCode = $this->getBranchCode( $dbio, $dbconn, $branName[ 1 ] );
                    // to get location_code from location_name if exist, otherwise will throw error.
                    $orderno = $datalist[ 'C2' ];
                    if ( $datalist[ 'C1' ] == 'Cust Sell' ) $ordertype = 'sell';
                    else if ( $datalist[ 'C1' ] == 'Cust Buy' ) $ordertype = 'buy';
                    else $ordertype = 'remit';

                    if ( $datalist[ 'C6' ] == 'Forex Card' ) $product = 'CARD';
                    else if ( $datalist[ 'C6' ] == 'Currency' ) $product = 'CN';
                    else $product = 'TT';

                    $isdcode = $datalist[ 'C7' ];
                    $amount = $datalist[ 'C8' ];
                    $custrate = $datalist[ 'C9' ];
                    $settlerate = 0;
                    $custname = '';
                    $ibr = $datalist[ 'C10' ];
                    $forexinr = $custrate * $amount;
                    if ( $datalist[ 'C12' ] == 'Complete' ) $status = 14;
                    else if ( $datalist[ 'C12' ] == 'Cancelled' ) $status = 5;
                    else $status = 1;
                }

                if ( $datalist[ 'C2' ] == null ) break;

                $isIsdExist = $this->getIsdCode( $dbio, $dbconn, $isdcode );
                // to get isd code from isd_name if exist, otherwise will throw error.
                $isOrderExist = $this->checkOrderExist( $dbio, $dbconn, $orderno );
                // to check if order already exist in table

                $ordernoArr[] = $orderno;
                $countOrder = array_count_values( $ordernoArr );
                // to check if more than one product exist with same order number
                if ( $countOrder[ $orderno ] > 1 ) $isRepeated = 1;
                else $isRepeated = 0;

                if ( $isRepeated == 0 ) {
                    $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    $uniquekey = substr( str_shuffle( $permitted_chars ), 0, 5 );
                    $qry = $qry."INSERT INTO lead_order (po_srno, po_leadsource, po_ordertype, po_productcount, po_product, po_product_2, po_currency, po_card_currency, 
                            po_quantity, po_card_quantity, po_buyrate, po_card_buyrate, po_totalamt, po_handlingcharge, po_nostrocharge, po_taxableval, po_CGST, 
                            po_SGST, po_IGST, po_sumamount, po_round, po_roundAmt, po_date, po_order_no, po_refno, po_status, po_nofpassenger, 
                            po_nofcurrency, po_travelpurpose, po_country, po_traveldate, po_usersrno, po_paymenttype, po_location, po_isplaced, 
                            po_paymentgateway, po_promocode, po_ispaid, po_profit, po_tcs, po_name, po_mobile, po_email, po_manuallead, po_leadaddby, po_donetimestamp)
                            SELECT (SELECT COALESCE(MAX(po_srno),0) FROM lead_order)+1, ".$requestObject->leadsource.", '".$ordertype."', 0, '".$product."', '', '".$isdcode."', '', 
                            ".$amount.', 0, '.$custrate.', 0, '.$forexinr.', 0, 0, 0, 0, 0, 0, '.$forexinr.', 0, '.$forexinr.", now(), '".$orderno."', 
                            CONCAT('ZFX','/', (SELECT COALESCE(MAX(po_srno),0)+1 FROM lead_order)), '".$status."', 0, 1, '', 0, '', 0, '', ".$branchCode.", 1, '', '', 0, ".$profit.", 0, '".$custname."', 
                            '', '', 1, ".$_SESSION[ 'userSrno' ].' ';
                    if ( $status == 14 ) $qry = $qry.' , NOW();';
                    // done leads
                    else $qry = $qry.' , NULL;';
                    // pending leads

                    $qry_1 = $qry_1."delete from master_account_details WHERE ac_orderno = '".$orderno."';
                    insert into master_account_details (ac_srno, ac_ordertype, ac_isverified, ac_timestamp, ac_orderno, ac_totalamount, ac_amounttobepaid, ac_amountpaid, ac_amountpending)
                    select (select COALESCE(MAX(ac_srno), 0) + 1 FROM master_account_details), '".$ordertype."',0, now(),'".$orderno."', ".$forexinr.', '.$forexinr.', 0, '.$forexinr.'; ';

                    $qry_2 = $qry_2."delete from lead_traveller WHERE lt_orderno = '".$orderno."';
                    insert into lead_traveller (lt_orderno, lt_srno, lt_ordertype, lt_traveller, lt_name, lt_timestamp) select '".$orderno."', (SELECT po_srno FROM lead_order WHERE po_order_no = '".$orderno."'), '".$ordertype."', 1, '".$custname."', now(); ";
                } else {
                    $prprofit = $this->getProfit( $dbio, $dbconn, $orderno );
                    $qry_5 = $qry_5.'UPDATE lead_order SET po_profit = 1* '.$prprofit.'+'.$profit.",
                    po_totalamt = 1* (SELECT ac_totalamount FROM master_account_details WHERE ac_orderno = '".$orderno."')+".$forexinr.", 
                    po_sumamount=1* (SELECT ac_totalamount FROM master_account_details WHERE ac_orderno = '".$orderno."')+".$forexinr.", 
                    po_roundAmt= 1* (SELECT ac_totalamount FROM master_account_details WHERE ac_orderno = '".$orderno."')+".$forexinr." WHERE po_order_no ='".$orderno."';";
                }

                $qry_3 = $qry_3."INSERT INTO lead_product (lp_orderno, lp_srno, lp_travellernum, lp_isd, lp_producttype, lp_quantity, lp_ibr, lp_settlementrate, lp_rateofexchange, lp_totalamt, lp_sumtotalamount, lp_timestamp, lp_pancard)
                    SELECT '".$orderno."', (SELECT po_srno FROM lead_order WHERE po_order_no = '".$orderno."'), '1', '".$isdcode."','".$product."', ".$amount.', '.$ibr.', '.$settlerate.', '.$custrate.', '.$forexinr.', '.$forexinr.", now(), ''; ";

                $qry_4 = $qry_4."INSERT INTO mis_product SELECT (SELECT COALESCE(max(tp_srno), 0) + 1 FROM mis_product), (SELECT po_srno FROM lead_order WHERE po_order_no = '".$orderno."'),
                    ".$_SESSION[ 'userSrno' ].", '".$isdcode."', '".$product."', ".$amount.', '.$custrate.', '.$settlerate.', '.$ibr.', 0, '.$forexinr.", '".$uniquekey."', '".$orderno."'; ";

                $br_code = explode( '^', $branchCode );
                $isd_code = explode( '^', $isIsdExist );

                // break loop if branchName or isdCode in excel does not match same in database.
                if ( count( $br_code )>1 or count( $isd_code )>1 ) {
                    $isOk = false;
                    $err_branch = $br_code[ 0 ];
                    $err_isd = $isd_code[ 0 ];
                    $err_line_no = $i;
                    break;
                }

                // break loop if any order already exist in database.
                if ( $isOrderExist[ 'exist' ] == 1 ) {
                    $isOk = false;
                    $err_branch = -1;
                    $err_line_no = $i;
                    $err_orderno = $isOrderExist[ 'orderno' ];
                    break;
                }

            }

            if ( $isOk ) {
                $dbconn = $dbio->getConn();
                $result = $dbio->batchQueries( $dbconn, $qry );
                // for lead_order ( main table )
                $dbio->closeConn( $dbconn );
                if ( $result ) {
                    $dbconn = $dbio->getConn();
                    $result = $dbio->batchQueries( $dbconn, $qry_1 );
                    // master_account_details ( account details table )
                    $dbio->closeConn( $dbconn );
                    $dbconn = $dbio->getConn();
                    $result = $dbio->batchQueries( $dbconn, $qry_3 );
                    // lead_product ( product details table )
                    $dbio->closeConn( $dbconn );
                    $dbconn = $dbio->getConn();
                    $result = $dbio->batchQueries( $dbconn, $qry_2 );
                    // lead_traveller ( traveller detail table )
                    $dbio->closeConn( $dbconn );
                    $dbconn = $dbio->getConn();
                    $result = $dbio->batchQueries( $dbconn, $qry_4 );
                    // mis_product ( table for showing product in opportunity menu )
                    $dbio->closeConn( $dbconn );
                    if ( $qry_5 != '' ) {
                        $dbconn = $dbio->getConn();
                        $result = $dbio->batchQueries( $dbconn, $qry_5 );
                        // updating main table if more than one product exist in uploaded excel
                        $dbio->closeConn( $dbconn );
                    }
                }
                if ( $result ) {
                    $this->msg = 1;
                    // success
                } else {
                    $this->msg = 2;
                    //Error during query execution
                }
            } else {
                $this->msg = 0;
                if ( $err_branch == -1 ) $this->errmsg = 'Entry with order number ['.$err_orderno.'] already exist, refer to line '.$err_line_no.'.';
                else $this->errmsg = 'Currency code ['.$err_isd.'] or Location ['.$err_branch.'] is invalid, refer to line no '.$err_line_no.'.';
            }
        }
    }

    // get profit

    private function getProfit( $dbio, $dbconn, $orderno ) {
        $sql = "select po_profit from lead_order WHERE po_order_no = '".$orderno."'";
        $result = $dbio->getSelect( $dbconn, $sql );
        $row = array();
        if ( mysqli_num_rows( $result )>0 ) {
            $row = mysqli_fetch_row( $result );
        }
        if ( count( $row )>0 ) return $row[ 0 ];
        return 0;
    }

    // check if order already exist

    private function checkOrderExist( $dbio, $dbconn, $orderno ) {
        $exist = 0;
        $sql = "select * from lead_order where po_order_no = '".$orderno."'";
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            $exist = 1;
        }
        return array( 'exist'=>$exist, 'orderno'=>$orderno );
    }

    // fetching branch code from branch_name

    private function getBranchCode( $dbio, $dbconn, $branName ) {
        $sql = "SELECT ml_branchcd FROM master_location WHERE ml_branch = trim('".$branName."')";
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            $row = mysqli_fetch_row( $result );
            return $row[ 0 ];
        } else {
            return $branName.'^0';
        }
    }

    // fetching isd_code from isd_name

    private function getIsdCode( $dbio, $dbconn, $code ) {
        $sql = "SELECT isd_code FROM master_isd WHERE isd_code = trim('".$code."')";
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            $row = mysqli_fetch_row( $result );
            return $row[ 0 ];
        } else {
            return $code.'^0';
        }
    }

    public function uploadBudgetData( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {
            $rndstr = 'BUDGET_'.$_SESSION[ 'userSrno' ].'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADDOCSPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $this->message = $r_message;

            require 'vendoroffice/autoload.php';
            $inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify( $target_file );
            if ( $inputFileType == 'Xls' ) {
                $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
            } else {
                $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
            }
            $spreadsheet = $reader->load( $target_file );
            $sheet = $spreadsheet->getSheet( 0 );
            $highestRow = $sheet->getHighestRow();
            $datalist = array();
            $sql = '';
            for ( $i = 2; $i <= $highestRow; $i++ ) {
                for ( $x = 1; $x <= 14; $x++ ) {
                    $datalist[ 'C'.$x ] = $sheet->getCellByColumnAndRow( $x, $i )->getValue();
                }
                if ( $requestObject->empBranSelect == 'E' ) {
                    $empsrno = $datalist[ 'C1' ];
                    $bransrno = 0;
                } else {
                    $bransrno = $datalist[ 'C1' ];
                    $empsrno = 0;
                }
                $aprilbudg = $datalist[ 'C3' ];
                $maybudg = $datalist[ 'C4' ];
                $junebudg = $datalist[ 'C5' ];
                $julybudg = $datalist[ 'C6' ];
                $augbudg = $datalist[ 'C7' ];
                $septbudg = $datalist[ 'C8' ];
                $octbudg = $datalist[ 'C9' ];
                $novbudg = $datalist[ 'C10' ];
                $decbudg = $datalist[ 'C11' ];
                $janbudg = $datalist[ 'C12' ];
                $febbudg = $datalist[ 'C13' ];
                $marbudg = $datalist[ 'C14' ];

                $sql = $sql.' DELETE FROM mis_budget WHERE misb_brancode = '.$bransrno.' AND misb_empcode ='.$empsrno." AND misb_finyear = '".FINYEAR."';
                        INSERT INTO mis_budget SELECT (SELECT COALESCE(MAX(misb_srno), 0) FROM mis_budget) + 1, 1, ".$bransrno.', '.$empsrno.", 1, '".FINYEAR."', ".$aprilbudg.",
                        ".$maybudg.','.$junebudg.','.$julybudg.','.$augbudg.','.$septbudg.','.$octbudg.','.$novbudg.','.$decbudg.','.$janbudg.','.$febbudg.','.$marbudg.';';
            }
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries( $dbconn, $sql );
            if ( $result ) {
                $this->msg = 1;
            } else {
                $this->msg = 0;
            }
            $dbio->closeConn( $dbconn );
        }
    }

    public function uploadCorpInvoice( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {

            $rndstr = 'INVOICE'.'_'.$requestObject->orderno.'_'.$dbio->getRandomString( 10 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADDOCSPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;

            $query = 'DELETE FROM lead_req_document WHERE doc_id = '.$requestObject->docid." AND doc_orderno = '".$requestObject->orderno."';
                    INSERT INTO lead_req_document(doc_orderno, doc_name, doc_id, doc_filename, doc_ext, doc_uploadedat)
                    VALUES ('".$requestObject->orderno."', '".$requestObject->uploadType."', ".$requestObject->docid.", '".$r_filename."', '".$ext."', now())";
            $dbconn = $dbio->getConn();
            $result = $dbio->batchQueries( $dbconn, $query );
            $dbio->closeConn( $dbconn );
            $qry = "INSERT INTO master_order_log(lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code)
            SELECT ".$_SESSION[ 'userSrno' ].", NOW(), '".$requestObject->orderno."'
            , CONCAT('Invoice Uploaded ', '".$r_filename."'), 'CORPORATE' ";
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect( $dbconn, $qry );
            $dbio->closeConn( $dbconn );
            $this->msg = $r_message;
        }
    }

    public function uploadThirdParty( $dbio, $requestObject ) {
        $r_error = '';
        $r_message = '';
        $r_filename = '';
        $r_docdetail = array();

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );
        if ( $fileError == UPLOAD_ERR_OK ) {
            $rndstr = 'THIRDPARTY_'.$_SESSION[ 'userSrno' ].'_'.$dbio->getRandomString( 8 );
            $path = pathinfo( $fileName );
            $ext = $path[ 'extension' ];
            $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
            $target_file = UPLOADDOCSPATH.str_replace( '/', '-', $rndstr ).'.'.$ext;
            move_uploaded_file( $temp_name, $target_file );
            $r_message = $fileName.' Upload Successfully';
            $r_filename = str_replace( '/', '-', $rndstr ).'.'.$ext;
            $this->message = $r_message;

            require 'vendoroffice/autoload.php';
            $inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify( $target_file );
            if ( $inputFileType == 'Xls' ) {
                $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
            } else {
                $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
            }
            $spreadsheet = $reader->load( $target_file );
            $sheet = $spreadsheet->getSheet( 0 );
            $highestRow = $sheet->getHighestRow();
            $datalist = array();
            $sql = '';
            $isOk = true;
            for ( $i = 2; $i <= $highestRow; $i++ ) {
                for ( $x = 1; $x <= 6; $x++ ) {
                    $datalist[ 'C'.$x ] = $sheet->getCellByColumnAndRow( $x, $i )->getValue();
                }
                $partycode = $datalist[ 'C1' ];
                $empcode = $datalist[ 'C2' ];
                $brancode = $datalist[ 'C3' ];
                $date = explode( '/', $datalist[ 'C4' ] );
                $sales = $datalist[ 'C5' ];
                $margin = $datalist[ 'C6' ];
                $res = $this->validateFile( $dbio, $partycode, $empcode, $brancode );
                $dbio->writeLog( '-------branch-------'.$res[ 'branch' ].'------party----------'.$res[ 'party' ].'----------emp-------------'.$res[ 'emp' ] );
                if ( $res[ 'branch' ] == 1 or $res[ 'party' ] == 1 or $res[ 'emp' ] == 1 ) {
                    $isOk = false;
                }
                $sql = $sql." INSERT INTO thirdpartycrm_sales (par_srno, par_partycode, par_empcode, par_brancode, par_date, par_sales, par_margin, par_timestamp, par_finyear)
                    SELECT (SELECT COALESCE(MAX(par_srno), 0) +1 FROM thirdpartycrm_sales), ".$partycode.', '.$empcode.' ,'.$brancode.", '".$date[ 2 ].'-'.$date[ 1 ].'-'.$date[ 0 ]."', ".$sales.", 
                    ".$margin.', NOW(), '.FINYEAR.'; ';
            }
            if ( $isOk ) {
                $dbconn = $dbio->getConn();
                $result = $dbio->batchQueries( $dbconn, $sql );
                if ( $result ) {
                    $this->msg = 1;
                } else {
                    $this->msg = 0;
                }
                $dbio->closeConn( $dbconn );
            } else {
                $this->msg = 2;
            }
        }

    }

    function generateRandomCode( $length = 12 ) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomCode = '';
        for ( $i = 0; $i < $length; $i++ ) {
            $randomCode .= $characters[ random_int( 0, strlen( $characters ) - 1 ) ];
        }
        return $randomCode;
    }

    private function validateFile( $dbio, $partycode, $empcode, $brancode ) {
        $branch = 0;
        $party = 0;
        $emp = 0;
        $sql = 'SELECT * FROM master_location WHERE ml_branchcd = '.$brancode.'';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )<1 ) {
            $branch = 1;
        }

        $sql = 'SELECT * FROM master_third_party WHERE part_srno = '.$partycode.'';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )<1 ) {
            $party = 1;
        }

        $sql = 'SELECT * FROM master_employee WHERE emp_srno = '.$empcode.'';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )<1 ) {
            $emp = 1;
        }
        $dbio->closeConn( $dbconn );
        return array( 'branch'=>$branch, 'party'=>$party, 'emp'=>$emp );
    }

    public function UploadCorpLeads( $dbio, $obj ) {
        $r_counter_error = 0;
        $errorDataArray = array();
        $r_message = '';
        $r_filename = '';
        $r_error = '';
        $rndstr = '';
        $r_docdetail = array();
        $ledgerData = array();
        $temp_activity_log_srno = '*temp_activity_log_srno*';

        $fileName = $_FILES[ 'file' ][ 'name' ];
        $fileType = $_FILES[ 'file' ][ 'type' ];
        $fileError = $_FILES[ 'file' ][ 'error' ];
        $fileContent = file_get_contents( $_FILES[ 'file' ][ 'tmp_name' ] );

        $path = pathinfo( $fileName );
        $ext = $path[ 'extension' ];
        $rndstr = $dbio->getRandomString( 8 );
        $temp_name = $_FILES[ 'file' ][ 'tmp_name' ];
        $target_file = TEMPPATH . $rndstr . '.' . $ext;
        move_uploaded_file( $temp_name, $target_file );

        $inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify( $target_file );
        $reader = new \PhpOffice\PhpSpreadsheet\Reader\xlsx();
        $spreadsheet = $reader->load( $target_file );
        $sheet = $spreadsheet->getSheet( 0 );
        $highestRow = $sheet->getHighestDataRow();
        $datalist = array();
        $uniquestring = $dbio->getRandomString( 20 );

        //********************************************************************** PARAMS ***************************************************** */
        $isliverate = 0;
        $isdlist = [];
        // $banklist = [];
        $branlist = [];
        $usercorpsrno = 0 ;
        $bankname = [];
        $bankcode = 0;
        $liverate = false;
        $insertCorpLeadsHeaderQry = '';
        $insertCorpLeadsProductQry = '';
        $uploadtimestamp = date( 'Y-m-d H:i:s' );
        $mobile = '';
        //**************************************** */

        // -----------------------------------------------------------------------------------------OPEN DATABASE
        $dbconn = $dbio->getConn();
        $sql = '';
        $qry = 'SELECT entity_liverate from master_entity WHERE entity_id = (SELECT user_corpsrno FROM user_login WHERE user_srno = '.$_SESSION[ 'userSrno' ].')';
        $res = $dbio->getSelect( $dbconn, $qry );
        if ( mysqli_num_rows( $res )>0 ) {
            $row = mysqli_fetch_row( $res );
            if ( $row[ 0 ]*1 > 0 ) {
                $isliverate = $row[ 0 ];
                $sql = $sql."SELECT DISTINCT cr_isd AS value, isd_name as label FROM master_isd 
                            LEFT OUTER JOIN corp_ratesmargin ON isd_code = cr_isd
                            WHERE isd_active = 1 AND cr_isd != '' AND  cr_corpsrno = (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION[ 'userSrno' ].') AND ';
                if ( $product == 'CARD' ) {
                    $sql = $sql." cr_product = 'CARD'";
                } else {
                    $sql = $sql." cr_product = 'CN'";
                }
            }
        } else {
            $isliverate = 0;
        }
        if ( $sql == '' ) {
            $sql = $sql.'SELECT isd_code as value, isd_name as label FROM master_isd WHERE isd_active = 1';
        }
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $isdlist[] = $row[ 'value' ];
                // Store each 'md_code' value into the array
            }
        }
        $query = "SELECT cu_branchcd, ml_branch FROM master_corporate_branch_link 
            LEFT OUTER JOIN master_location ON cu_branchcd = ml_branchcd	
            WHERE cu_usersrno = ".$_SESSION[ 'userSrno' ].' ORDER BY ml_branch';
        $result1 = $dbio->getSelect( $dbconn, $query );
        if ( mysqli_num_rows( $result1 ) > 0 ) {
            while( $row = mysqli_fetch_assoc( $result1 ) ) {
                $branlist[] = $row[ 'cu_branchcd' ];
                // Store each 'md_code' value into the array
            }
        }
        $qry = 'SELECT user_corpsrno FROM user_login WHERE user_srno ='.$_SESSION[ 'userSrno' ].'';
        $result1 = $dbio->getSelect( $dbconn, $qry );
        if ( mysqli_num_rows( $result1 ) > 0 ) {
            while( $row = mysqli_fetch_assoc( $result1 ) ) {
                $usercorpsrno = $row[ 'user_corpsrno' ];
                // Store each 'md_code' value into the array
            }
        }
        $q = 'SELECT mcb_bsrno, mcb_bname,mcb_code FROM master_card_bank WHERE mcb_active = 1';
        $r = $dbio->getSelect( $dbconn, $q );
        if ( mysqli_num_rows( $r ) > 0 ) {
            while( $row = mysqli_fetch_assoc( $r ) ) {
                $bankname[] = $row[ 'mcb_code' ];
            }
        }
        $dbio->closeConn( $dbconn );
        //------------------------------------------------------------------------------------------CLOSE THE CONNECTION

        // -----------------------------------------------------------------------------------------PROCESS EXCEL DATA
        if ( $highestRow < 2 ) {
            $r_error = 'Incorrect Data Format.';
            $r_message = 'Incorrect Data Format.';
        }
        $prevsrno = 0;
        $uniueorderno = 1;
        for ( $i = 4; $i <= $highestRow; $i++ ) {
            for ( $x = 1; $x <= 17; $x++ ) {
                $datalist[ 'C' . $x ] = trim( $sheet->getCellByColumnAndRow( $x, $i )->getValue() );
            }
            //--------------------------------------------------------------------------------------HEADER VALIDATION
            if ( $i == 4 && !(
                trim( $datalist[ 'C1' ] == 'SrNo' ) and
                trim( $datalist[ 'C2' ] == 'Branch' ) and
                trim( $datalist[ 'C3' ] == 'Order Type(BUY/SALE)' ) and
                trim( $datalist[ 'C4' ] == 'Employee code' ) and
                trim( $datalist[ 'C5' ] == 'Travel Permit(TP No)' ) and
                trim( $datalist[ 'C6' ] == 'Traveller Name' ) and
                trim( $datalist[ 'C7' ] == 'Passport No' ) and
                trim( $datalist[ 'C8' ] == 'EMAIL ID' ) and
                trim( $datalist[ 'C9' ] == 'Product' ) and
                trim( $datalist[ 'C10' ] == 'Currency CODE' ) and
                trim( $datalist[ 'C11' ] == 'QTY/VALUE' ) and
                trim( $datalist[ 'C12' ] == 'Card type' ) and
                trim( $datalist[ 'C13' ] == 'Card bank name' ) and
                trim( $datalist[ 'C14' ] == 'Card Number' ) and
                trim( $datalist[ 'C15' ] == 'Mobile Number' )
            ) ) {
                $r_counter_error = 2;
                array_push( $errorDataArray, [ 'desc' => 'Incorrect Header Data Formet' ] );
                break;
            }
            ;
            //--------------------------------------------------------------------------------------SETTING THE VALUES
            if ( $i != 4 ) {
                $srno = $datalist[ 'C1' ];
                $branch = $datalist[ 'C2' ];
                $ordertype = $datalist[ 'C3' ];
                $nEmpCode = $datalist[ 'C4' ];
                $nTpCode = $datalist[ 'C5' ];
                $ntravellerName = $datalist[ 'C6' ];
                $npassportNum = $datalist[ 'C7' ];
                $nemail = $datalist[ 'C8' ];
                $product = $datalist[ 'C9' ];
                $isd = $datalist[ 'C10' ];
                $quantity = $datalist[ 'C11' ];
                $cardtype = $datalist[ 'C12' ];
                $cardname = $datalist[ 'C13' ];
                $cardnumber = $datalist[ 'C14' ];
                $mobile = $datalist[ 'C15' ];

                //check row is empty
                // //-------------------------------------------LEDGER NAME
                // if ( $mvli_ledger_name == '' ) {
                //     $r_counter_error = 1;
                //     array_push( $errorDataArray, [ 'desc' => "Ledger Name Can't Be Empty", 'row' => "  .$i.", 'col' => ".$x." ] );
                // }
                // //-------------------------------------------LEDGER NAME

                if ( $branch == '' ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => "Branch can't be Empty", 'row' => ".$i.", 'col' => ".$x." ] );
                } elseif ( !in_array( $branch, $branlist ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Invalid Branch', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( !( $ordertype == 'BUY' || $ordertype == 'SELL' ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Invalid Ordertype', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( $nEmpCode === '' || !is_numeric( $nEmpCode ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Employee Code', 'row' => ".$i.", 'col' => ".$x." ] );
                }

                if ( $nTpCode == '' || !is_numeric( $nTpCode ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'TP Code', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( $ntravellerName == '' ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Traveller name', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( $npassportNum == '' ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Passport Number', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( !( $product == 'CN' || $product == 'CARD' ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Product either CN/CARD', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( $isd == '' ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => "ISD can't be Empty", 'row' => ".$i.", 'col' => ".$x." ] );
                } elseif ( !in_array( $isd, $isdlist ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Invalid ISD', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                $dbio->writeLog( json_encode( $bankname ) );
                $dbio->writeLog( $cardname );

                if ( $cardtype == 'RELOAD' && !in_array( $cardname, $bankname ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Invalid Card Name', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( $quantity == '' || !is_numeric( $quantity ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Passport Number', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( $product == 'CN' ) {
                    $cardtype = '';
                    $cardname = '';
                    $cardnumber = '0';
                }
                if ( ( $product == 'CARD' && $cardtype != 'SALE' && $cardtype != 'RELOAD' ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'Card type must be sale/reload', 'row' => ".$i.", 'col' => ".$x." ] );
                }

                if ( ( $ordertype == 'SELL' ) && ( $cardnumber == '' ) && ( $cardnumber == 0 ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'In sell case cardnumber is mandatory.', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( $cardname != '' ) {
                    $q = "SELECT mcb_bsrno FROM master_card_bank WHERE mcb_code = '".$cardname."' ;";
                    $dbconn = $dbio->getConn();
                    $r = $dbio->getSelect( $dbconn, $q );
                    $dbio->closeConn( $dbconn );
                    if ( mysqli_num_rows( $r ) > 0 ) {
                        while( $row = mysqli_fetch_row( $r ) ) {
                            $bankcode = $row[ 0 ];
                        }
                    }
                }
                if ( $cardtype == 'SALE' ) {
                    $bankcode = 0 ;
                }
                if ( ( $cardtype == 'RELOAD' ) && ( $cardname == '' ) && ( $cardnumber == '' ) && ( $cardnumber == 0 ) ) {
                    $r_counter_error = 1;
                    array_push( $errorDataArray, [ 'desc' => 'In reload case bankname/cardnumber is mandatory.', 'row' => ".$i.", 'col' => ".$x." ] );
                }
                if ( $mobile !== '' ) {
                    if ( !ctype_digit( $mobile ) ) {
                        $r_counter_error = 1;
                        array_push( $errorDataArray, [ 'desc' => 'Invalid Mobile number.', 'row' => ".$i.", 'col' => ".$x." ] );
                    }
                    // check length 10
                    elseif ( strlen( $mobile ) !== 10 ) {
                        $r_counter_error = 1;
                        array_push( $errorDataArray, [ 'desc' => 'Mobile number length is not more then 10 .', 'row' => ".$i.", 'col' => ".$x." ] );
                        ;
                    }
                }
                // ---------------------------------------------------------------------------------   FINAL QUERY    ------------------------------------------------
                //--------------------------------------------------------------------------INSERT INTO MASTER_VOUCHER_LEDGER-----------------------------------------
                date_default_timezone_set( 'Asia/Kolkata' );
                // $dbio->writeLog( $srno );
                // $dbio->writeLog( $prevsrno );
                $cardnumber = preg_replace( '/\s+/', '', $cardnumber );
                if ( $srno != $prevsrno ) {
                    $randomNumber = $this->generateRandomCode();
                    $uniquenum = date( 'ymdHis' ) . $uniueorderno;
                    $insertCorpLeadsHeaderQry .= "INSERT INTO corp_leads (cl_srno, cl_orderno, cl_ordertype, cl_corpsrno, cl_name, cl_passport, cl_adhaarno, cl_timestamp, cl_branchcd
                            , cl_gst, cl_totalinr, cl_totalinvoice, cl_receivedinr, cl_requestedinr, cl_other_charges, cl_corpempcode, cl_status, cl_tp_no 
                            , cl_ntraveller , cl_npassport ,cl_upload_timestamp , cl_uploaded_by, cl_entry_source,cl_nemail ,cl_unique_key_mail_identifier
                            ,cl_sendmail,cl_email_timestamp,cl_send_mail_flag , cl_mobile)
                            SELECT (SELECT COALESCE(MAX(cl_srno), 0)+1 FROM corp_leads), CONCAT('".$uniquenum."', '/',".$usercorpsrno."), '".$ordertype."'
                            , ".$usercorpsrno." ,'".$ntravellerName."' , '".$npassportNum."', '', NOW(), ".$branch.", 0, 0, 0, 0, 0, 0, '".$nEmpCode."'";
                    if ( $liverate ) {
                        $insertCorpLeadsHeaderQry = $insertCorpLeadsHeaderQry.', 1 ';
                    } else {
                        $insertCorpLeadsHeaderQry = $insertCorpLeadsHeaderQry.', 3 ';
                    }
                    $insertCorpLeadsHeaderQry .= ", '".$nTpCode."' , '".$ntravellerName."' , '".$npassportNum."' , '".$uploadtimestamp."' ,".$_SESSION[ 'userSrno' ].",'UPLOAD', '".$nemail."'  
                    ,concat('".$randomNumber."','/','".$uniquenum."','/',".$usercorpsrno.") ,1 , now(),1 , '".$mobile."';";
                    $uniueorderno++;
                }
                $cardtypeChar = '';
                if ( $cardtype == 'SALE' ) $cardtypeChar = 'S';
                if ( $cardtype == 'RELOAD' ) $cardtypeChar = 'R';
                $insertCorpLeadsProductQry .= "INSERT INTO corp_product (cp_orderno, cp_ordertype, cp_product, cp_isdcode, cp_quantity, cp_exchangerate, cp_timestamp, 
                        cp_srno, cp_ordersave, cp_uniquenum, cp_totalinr, cp_cardtype, cp_cardnumber, cp_cardbankcode, cp_cardvalue) 
                        SELECT CONCAT('".$uniquenum."', '/', ".$usercorpsrno."),
                        '".$ordertype."', '".$product."', '".$isd."', ".$quantity.",0, NOW(), (SELECT COALESCE(MAX(cp_srno), 0)+1 FROM corp_product), 0,
                        '".$uniquenum."', 0, '".$cardtypeChar."', '".$cardnumber."', ".$bankcode.', '.$quantity.'; ';
                $prevsrno = $srno;
            }

        }

        if ( $r_counter_error < 1 ) {
            $dbconn = $dbio->getConn();
            $finalQuery = $insertCorpLeadsHeaderQry.$insertCorpLeadsProductQry;
            $dbio->batchQueries( $dbconn, $finalQuery );
            $dbio->closeConn( $dbconn );
            $dbio->writeLog( 'this is me' );
            if ( true ) {
                array_push( $errorDataArray, [ 'desc' => 'Upload Successfully.' ] );
                $r_message = 'Upload Successfully';
            } else {
                array_push( $errorDataArray, [ 'desc' => 'Upload error contact to the Administartion.' ] );
                $r_error = 'Upload error contact to the Administartion';
            }
        }
        $right = new Right();
        $right->getUserNavRight( $dbio, 'CORPMODULE' );
        $leadlist = array();
        $sql = $this->leadDataQry( $obj, $right );
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $leadlist[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );
        return array( 'err' => $r_error, 'msg' => $r_message, 'docdetail' => $r_docdetail, 'error' => $r_counter_error, 'errordata' => $errorDataArray, 'leadlist' =>$leadlist );
    }

    private function leadDataQry( $obj, $right ) {
        $sql = "SELECT cl_srno, cl_orderno, mcs_statusname, cl_status, cl_ordertype, ml_branch, DATE_FORMAT(cl_timestamp, '%d-%m-%Y') AS cl_time
                , cl_totalinr, cl_gst, cl_totalinvoice, cl_receivedinr,entity_name  FROM corp_leads
            LEFT OUTER JOIN master_corp_status ON cl_status = mcs_srno 
            LEFT OUTER JOIN master_entity ON cl_corpsrno = entity_id";
        if ( $right->edit == '0' ) {
            $sql = $sql.' LEFT OUTER JOIN master_location ON cl_branchcd = ml_branchcd ';
        } else {
            $sql = $sql." LEFT OUTER JOIN (SELECT mu_branchcd, mu_usersrno, ml_branch FROM master_user_branch_link 
                LEFT OUTER JOIN master_location ON mu_branchcd = ml_branchcd WHERE mu_usersrno = ".$_SESSION[ 'userSrno' ].') AS t ON cl_branchcd = mu_branchcd ';
        }
        $sql = $sql.' WHERE 1=1 ';
        $sql = $sql.' ORDER BY cl_timestamp DESC ';
        return $sql;
    }

}

?>