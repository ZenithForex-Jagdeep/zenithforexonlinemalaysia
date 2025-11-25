<?php
require_once( 'mail_c.php' );
require 'vendoroffice/autoload.php';

class CorpModule {

    public function getIsdLiveRate( $dbio, $obj ) {
        $sql = "SELECT isd_code, cr_product, isd_name
                    , ROUND(CASE WHEN 'G' = 'F' THEN cr_buymargin
                    WHEN 'M' = 'M' THEN  or_sellrate + cr_buymargin
                    WHEN 'Q' = 'P' THEN (or_sellrate*cr_buymargin/100)+or_sellrate
                    END, 3) AS cr_buymargin
                    , ROUND(CASE WHEN 'G' = 'F' THEN cr_sellmargin
                    WHEN 'M' = 'M' THEN or_buyrate - cr_sellmargin
                    WHEN 'Q' = 'P' THEN or_buyrate - (or_buyrate*cr_sellmargin/100)
                    END, 3) AS cr_sellmargin 
                    FROM
                    (SELECT isd_code ,cr_buymargin, cr_sellmargin , or_sellrate, or_buyrate, cr_product, isd_name
                    FROM master_isd
                    LEFT OUTER JOIN corp_ratesmargin ON cr_isd= isd_code AND cr_product='".$obj->product."'
                    LEFT OUTER JOIN 
                    (SELECT or_isd,or_sellrate,or_buyrate FROM master_online_rates WHERE or_refno = (SELECT MAX(or_refno) FROM master_online_rates)) AS mor 
                    ON isd_code = or_isd
                    WHERE isd_active = 1 AND 
                    cr_corpsrno = (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION[ 'userSrno' ].") 
                    AND isd_code = '".$obj->isd."' AND ";
        if ( $obj->product == 'CN' ) {
            $sql = $sql.' isd_cash = 1) AS t';
        } else {
            $sql = $sql.' isd_card = 1) AS t';
        }
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            $row = mysqli_fetch_row( $result );
            $this->msg = 1;
            $this->isd = $row[ 0 ];
            $this->product = $row[ 1 ];
            $this->buyrate = $row[ 3 ];
            $this->sellrate = $row[ 4 ];
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn( $dbconn );
    }

    public function getCorpData( $dbio, $product ) {
        //$isdlist = array();
        $sql = '';
        $qry = 'SELECT entity_liverate from master_entity WHERE entity_id = (SELECT user_corpsrno FROM user_login WHERE user_srno = '.$_SESSION[ 'userSrno' ].')';
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect( $dbconn, $qry );
        $this->msg = 1;
        if ( mysqli_num_rows( $res )>0 ) {
            $row = mysqli_fetch_row( $res );
            if ( $row[ 0 ]*1 === 1 ) {
                //for live rate
                $this->isliverate = $row[ 0 ];
                $sql = $sql."SELECT DISTINCT cr_isd AS value, isd_name as label FROM master_isd 
                            LEFT OUTER JOIN corp_ratesmargin ON isd_code = cr_isd
                            WHERE isd_active = 1 AND cr_isd != '' AND  cr_corpsrno = (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION[ 'userSrno' ].') AND ';
                if ( $product == 'CARD' ) {
                    $sql = $sql." cr_product = 'CARD'";
                } else {
                    $sql = $sql." cr_product = 'CN'";
                }
            } else if ( $row[ 0 ]*1 === 2 ) {
                //for live rate
                $this->isliverate = $row[ 0 ];
                $sql = $sql."SELECT DISTINCT isd_code AS value, isd_name AS label FROM master_isd 
                            INNER JOIN master_rate_corporate ON mrc_isd = isd_code                
                            WHERE isd_active = 1 AND mrc_product = '".$product."' AND mrc_entity_id = (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION[ 'userSrno' ].')  ';
            } else {
                $this->isliverate = 0;
            }
        } else {
            $this->isliverate = 0;
        }
        if ( $sql == '' ) {
            $sql = $sql.'SELECT isd_code as value, isd_name as label FROM master_isd WHERE isd_active = 1';
        }
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $this->isdlist[] = $row;
            }
        }

        $q = 'SELECT mcb_bsrno, mcb_bname FROM master_card_bank WHERE mcb_active = 1';
        $r = $dbio->getSelect( $dbconn, $q );
        if ( mysqli_num_rows( $r ) > 0 ) {
            while( $row = mysqli_fetch_assoc( $r ) ) {
                $this->banklist[] = $row;
            }
        } else {
            $this->banklist[] = array();
        }

        $query = "SELECT cu_branchcd, ml_branch FROM master_corporate_branch_link 
            LEFT OUTER JOIN master_location ON cu_branchcd = ml_branchcd	
            WHERE cu_usersrno = ".$_SESSION[ 'userSrno' ].' ORDER BY ml_branch';
        $result1 = $dbio->getSelect( $dbconn, $query );
        if ( mysqli_num_rows( $result1 ) > 0 ) {
            while( $row = mysqli_fetch_assoc( $result1 ) ) {
                $this->branlist[] = $row;
            }
        } else {
            $this->branlist[] = array( 'cu_branchcd'=> 0, 'ml_branch'=>'0' );
        }
        $dbio->closeConn( $dbconn );
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

        if ( $right->edit == '0' ) {
            $sql = $sql.' AND cl_corpsrno = (SELECT user_corpsrno FROM user_login WHERE user_srno = '.$_SESSION[ 'userSrno' ].') ';
        } else {
            $sql = $sql." AND ml_branch != '' ";
        }

        if ( $obj->orderno != '' ) {
            $sql = $sql." AND cl_orderno = '".$obj->orderno."' ";
        } else {
            if ( $obj->status != '' ) {
                $sql = $sql.' AND cl_status = '.$obj->status.' ';
            }
            if ( $obj->type != '' ) {
                $sql = $sql." AND cl_ordertype = '".$obj->type."' ";
            }
            $sql = $sql." AND DATE_FORMAT(cl_timestamp,'%Y-%m-%d') BETWEEN '".$obj->frmdate."' AND '".$obj->todate."' ";
        }
        $sql = $sql.' ORDER BY cl_timestamp DESC ';
        return $sql;
    }

    public function getLeadData( $dbio, $obj, $right ) {
        $leadlist = array();
        $sql = $this->leadDataQry( $obj, $right );
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $leadlist[] = $row;
            }
        }
        return $leadlist;
        $dbio->closeConn( $dbconn );
    }

    public function downloadCorpReport( $dbio, $obj, $right ) {
        $filename = $dbio->getRandomString( 8 ).'.xls';
        $sql = $this->leadDataQry( $obj, $right );
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $strRep = '';
        $strRep = $strRep.'<table>';
        $strRep = $strRep.'<thead><tr>';
        $strRep = $strRep.'<th>Order Type</th>';
        $strRep = $strRep.'<th>Order Number</th>';
        $strRep = $strRep.'<th>Branch</th>';
        $strRep = $strRep.'<th>Total INR</th>';
        $strRep = $strRep.'<th>Gst</th>';
        $strRep = $strRep.'<th>Total Invoice</th>';
        $strRep = $strRep.'<th>Amount Received/Paid</th>';
        $strRep = $strRep.'<th>Status</th>';
        $strRep = $strRep.'<th>Date</th>';
        $strRep = $strRep.'</tr></thead>';
        $strRep = $strRep.'<tbody>';
        if ( mysqli_num_rows( $result )>0 ) {

            while( $row = mysqli_fetch_row( $result ) ) {
                $strRep = $strRep.'<tr>';
                $strRep = $strRep.'<td>'.$row[ 4 ].'</td>';
                $strRep = $strRep.'<td>'.$row[ 1 ].'</td>';
                $strRep = $strRep.'<td>'.$row[ 5 ].'</td>';
                $strRep = $strRep.'<td>'.$row[ 7 ].'</td>';
                $strRep = $strRep.'<td>'.$row[ 8 ].'</td>';
                $strRep = $strRep.'<td>'.$row[ 9 ].'</td>';
                $strRep = $strRep.'<td>'.$row[ 10 ].'</td>';
                $strRep = $strRep.'<td>'.$row[ 2 ].'</td>';
                $strRep = $strRep.'<td>'.$row[ 6 ].'</td>';
                $strRep = $strRep.'</tr>';
            }
        }
        $strRep = $strRep.'</tbody>';
        $strRep = $strRep.'</table>';
        $dbio->closeConn( $dbconn );
        header( 'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
        header( 'Content-Disposition: attachment;filename="'.$filename.'"' );
        echo( $strRep );
    }

    public function getLeadDataBySrno( $dbio, $orderno ) {
        $sql = "SELECT cp_orderno, cp_ordertype, cp_product, cp_isdcode, isd_name, cp_quantity, cp_exchangerate, cp_srno, cp_totalinr, cp_uniquenum, 
                    cp_cardtype, cp_cardnumber, cp_cardbankcode, mcb_bname, cp_cardvalue FROM corp_product
                    LEFT OUTER JOIN master_isd ON cp_isdcode = isd_code
                    LEFT OUTER JOIN master_card_bank ON cp_cardbankcode = mcb_bsrno
            WHERE cp_orderno = '".$orderno."' ORDER BY cp_timestamp DESC";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $this->product[] = $row;
            }
        }

        $qry = "SELECT cl_status, cl_totalinr, cl_gst, cl_totalinvoice, cl_ordertype
            , cl_name, cl_passport, cl_corpempcode ,cl_scheduledate, cl_tp_no , corp_payment_user_email, cl_mobile 
            FROM corp_leads 
            WHERE cl_orderno = '".$orderno."'";
        $res = $dbio->getSelect( $dbconn, $qry );
        if ( mysqli_num_rows( $res )>0 ) {
            $r = mysqli_fetch_row( $res );
            $this->status = $r[ 0 ];
            $this->totalinr = $r[ 1 ];
            $this->gst = $r[ 2 ];
            $this->totalinvoice = $r[ 3 ];
            $this->ordertype = $r[ 4 ];
            $this->travellername = $r[ 5 ];
            $this->passport = $r[ 6 ];
            $this->empcode = $r[ 7 ];
            $this->scheduledate = $r[ 8 ];
            $this->tpno = $r[ 9 ];
            $this->useremail = $r[ 10 ];
            $this->mobile = $r[ 11 ];
        }
        $dbio->closeConn( $dbconn );
        $this->commentlog = $this->getCommentLog( $dbio, $orderno );
    }

    public function getUniqueNum( $dbio ) {
        $randomid = date( 'ymdhis' );
        $this->uniquenum = $randomid;
    }

    public function getProductList( $dbio, $uniquenum ) {
        $sql = "SELECT cp_orderno, cp_ordertype, cp_product, cp_isdcode, isd_name, cp_quantity, cp_exchangerate, cp_srno, cp_totalinr, cp_cardtype, cp_cardnumber, 
                    cp_cardbankcode, mcb_bname, cp_cardvalue FROM corp_product
                    LEFT OUTER JOIN master_isd ON cp_isdcode = isd_code
                    LEFT OUTER JOIN master_card_bank ON mcb_bsrno = cp_cardbankcode
            WHERE cp_orderno = CONCAT('".$uniquenum."', '/', (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION[ 'userSrno' ].')) ORDER BY cp_timestamp DESC';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $productlist = array();
        if ( mysqli_num_rows( $result )>0 ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $productlist[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );
        return $productlist;
    }

    public function addCorpProduct( $dbio ) {
        $sql = '';
    }

    public function addProductDetail( $dbio, $obj ) {
        $totalinr = $obj->quantity * $obj->isdrate * ( $obj->cardValue == 0 ? 1 : $obj->cardValue );
        $sql = "INSERT INTO corp_product (cp_orderno, cp_ordertype, cp_product, cp_isdcode, cp_quantity, cp_exchangerate, cp_timestamp, 
                    cp_srno, cp_ordersave, cp_uniquenum, cp_totalinr, cp_cardtype, cp_cardnumber, cp_cardbankcode, cp_cardvalue, cp_withdrawal_type) 
                    SELECT CONCAT('".$obj->uniquenum."', '/', (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION[ 'userSrno' ].")),
                    '".$obj->ordertype."', '".$obj->product."', '".$obj->isd."', ".$obj->quantity.', '.$obj->isdrate.", NOW(), (SELECT COALESCE(MAX(cp_srno), 0)+1 FROM corp_product), 0,
                    '".$obj->uniquenum."', ROUND(".$totalinr.", 0), '".$obj->cardtype."', '".$obj->cardnumber."', ".$obj->cardbankcode.', '.$obj->cardValue.", '".$obj->withdrawalType."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $this->msg = 1;
            $this->orderno = $obj->uniquenum;
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn( $dbconn );
    }

    public function deleteProduct( $dbio, $srno ) {
        $sql = 'DELETE FROM corp_product WHERE cp_srno = '.$srno.'';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $this->msg = 1;
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn( $dbconn );
    }

    function generateRandomCode( $length = 12 ) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomCode = '';
        for ( $i = 0; $i < $length; $i++ ) {
            $randomCode .= $characters[ random_int( 0, strlen( $characters ) - 1 ) ];
        }
        return $randomCode;
    }

    public function saveLeadDetail( $dbio, $obj ) {
        $qry = 'SELECT user_corpsrno FROM user_login WHERE user_srno ='.$_SESSION[ 'userSrno' ].'';
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect( $dbconn, $qry );
        if ( mysqli_num_rows( $res )>0 ) {
            $row = mysqli_fetch_row( $res );
            // Encode karna zaroori hai agar special characters hain
            $randomNumber = $this->generateRandomCode();
            $queryParam = urlencode( $randomNumber.'/'.$obj->uniquenum.'/'.$row[ 0 ].'/'.$obj->ordertype );
            $sql = "INSERT INTO corp_leads (cl_srno, cl_orderno, cl_ordertype, cl_corpsrno, cl_name, cl_passport, cl_adhaarno, cl_timestamp, cl_branchcd
                        , cl_gst, cl_totalinr, cl_totalinvoice, cl_receivedinr, cl_requestedinr, cl_other_charges, cl_corpempcode, cl_status, cl_tp_no 
                        , cl_ntraveller , cl_npassport , cl_nemail,cl_unique_key_mail_identifier ,cl_sendmail ,cl_email_timestamp,corp_payment_user_email, cl_mobile)
                        SELECT (SELECT COALESCE(MAX(cl_srno), 0)+1 FROM corp_leads), CONCAT('".$obj->uniquenum."', '/',".$row[ 0 ]."), '".$obj->ordertype."'
                        , ".$row[ 0 ]." ,'".$obj->ntravellerName."' , '".$obj->npassportNum."', '', NOW(), ".$obj->branch.', '.$obj->gst.', '.$obj->totalinr.', '.$obj->totalinvoice.", 0, 0, 0, '".$obj->nEmpCode."'";
            if ( $obj->liverate ) {
                $sql = $sql.', 1 ';
            } else {
                $sql = $sql.', 3 ';
            }
            $sql .= ", '".$obj->nTpCode."' , '".$obj->ntravellerName."' , '".$obj->npassportNum."' , '".$obj->nEmail."' , concat('".$randomNumber."','/','".$obj->uniquenum."','/',".$row[ 0 ]."),1 , now() 
                ,'".$obj->nEmail."' , '".$obj->mobile."' ;";
            $result = $dbio->getSelect( $dbconn, $sql );
            $queryParam = $dbio->encryptData( $queryParam );
            if ( LIVE ) {
                $url = 'https://www.zenithglobal.com.my/corporate_upload?data=' . $queryParam;
            } else {
                $url = 'http://localhost:8005/corporate_upload?data=' . $queryParam;
            }
            $finalURL = urldecode( $url );
            $dbio->writeLog( $url );
            if ( $result ) {
                if ( $_SESSION[ 'isEmailVisible' ] == '1' && $obj->filterSendmail == true ) {
                    $to = $obj->nEmail;
                    $subject = 'ZENCORPTECH | UPLOAD REQUIRED DOCUMENTS | ORDER NUMBER: '.$row[ 0 ].' ';
                    $msg = 'Dear User ';
                    $msg = $msg."<br/><br/>Hope you're doing well! <br/><br/>";
                    $msg = $msg.'<br/><br/>We kindly request you to upload the required document(s) to complete your process.<br/><br/>';
                    $msg = $msg.'<br/><br/>Please find the details below: <br/><br/>';
                    $msg = $msg.'<br/><br/> **Upload link: '.$finalURL.' <br/><br/>';
                    // $msg = $msg.' '.$url.' <br/>';
                    // $msg = $msg.' '.$finalURL.' <br/>';
                    $msg = $msg.' <br/><br/>Thanks & Regards<br/>';
                    $cc = '';
                    $bcc = '';
                    $toname = '';
                    $myMail = new Mymail();
                    $r = $myMail->sendMail( $subject, $msg, $to, $cc, $bcc, $toname );
                    if ( $r != 1 ) {
                        //$this->msg( 'Not able to send email.' );
                    }
                }
                $this->msg = 1;
                $this->orderno = $obj->uniquenum.'/'.$row[ 0 ];
                $query = "UPDATE corp_product SET cp_ordersave = 1 WHERE cp_orderno = CONCAT('".$obj->uniquenum."','/',".$row[ 0 ].')';
                $resu = $dbio->getSelect( $dbconn, $query );
                $query1 = "UPDATE master_order_remark SET rem_orderno = '".$this->orderno."' WHERE rem_orderno = CONCAT('".$obj->uniquenum."','/',".$_SESSION[ 'userSrno' ].')';
                $resu1 = $dbio->getSelect( $dbconn, $query1 );
            } else {
                $this->msg = 0;
            }
        }
        $dbio->closeConn( $dbconn );
    }

    public function updateInrValue( $dbio, $obj ) {
        $sql = 'UPDATE corp_leads SET cl_totalinr = '.$obj->totalinr.', cl_gst = '.$obj->gst.', cl_totalinvoice = '.$obj->totalinvoice." 
                WHERE cl_orderno = CONCAT('".$obj->uniquenum."', '/', (SELECT user_corpsrno FROM user_login WHERE user_srno = ".$_SESSION[ 'userSrno' ].'))';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $this->msg = 1;
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn( $dbconn );
    }

    public function getEntityList( $dbio ) {
        $entitylist = array();
        $isdlist = array();
        $sql = "SELECT '' as value, 'Select' as label UNION ALL
                    SELECT entity_id AS value, entity_name AS label FROM master_entity WHERE entity_type = 'A' AND entity_active = 1 AND entity_liverate = 1";
        $dbconn  = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $entitylist[] = $row;
            }
        }

        $qry = "SELECT '' as value, 'Select' as label UNION ALL
                    SELECT isd_code AS value, isd_name AS label FROM master_isd WHERE isd_active = 1 ";
        $result1 = $dbio->getSelect( $dbconn, $qry );
        if ( $result1 ) {
            while( $row = mysqli_fetch_assoc( $result1 ) ) {
                $isdlist[] = $row;
            }
        }
        return array( 'isdlist'=>$isdlist, 'entitylist'=>$entitylist );
        $dbio->closeConn( $dbconn );
    }

    public function addIsdMargin( $dbio, $obj ) {
        $sql = 'DELETE FROM corp_ratesmargin WHERE cr_corpsrno = '.$obj->entity." AND cr_product = '".$obj->product."' AND cr_isd = '".$obj->isd."'; 
                    INSERT INTO corp_ratesmargin SELECT ".$obj->entity.", '".$obj->product."', '".$obj->isd."', ".$obj->isdmargin.', '.$obj->isdsellmargin.", NOW(), 
                    (SELECT COALESCE(MAX(cr_srno), 0)+1 FROM corp_ratesmargin) ";
        $dbconn = $dbio->getConn();
        $result = $dbio->batchQueries( $dbconn, $sql );
        $this->msg = $result;
        $dbio->closeConn( $dbconn );
    }

    public function getIsdMarginList( $dbio, $entity ) {
        $marginlist = array();
        $sql = 'SELECT cr_srno, cr_product, cr_isd, cr_buymargin, cr_sellmargin FROM corp_ratesmargin WHERE cr_corpsrno = '.$entity.' ORDER BY cr_timestamp DESC';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $marginlist[] = $row;
            }
        }
        return $marginlist;
        $dbio->closeConn( $dbconn );
    }

    public function deleteMargin( $dbio, $srno ) {
        $sql = 'DELETE FROM corp_ratesmargin WHERE cr_srno = '.$srno.' ';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $this->msg = $result;
        $dbio->closeConn( $dbconn );
    }

    private function getEntityQuery( $id ) {
        $sql = 'SELECT entity_id, entity_name, entity_liverate, entity_active, entity_outstandingtype FROM master_entity ';
        if ( $id*1 > 0 ) {
            $sql = $sql.' WHERE entity_id = '.$id.' ';
        }
        return $sql;
    }

    public function getEntities( $dbio ) {
        $entitylist = array();
        $sql = $this->getEntityQuery( 0 );
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $entitylist[] = $row;
            }
        }
        return $entitylist;
        $dbio->closeConn( $dbconn );
    }

    public function getEntityById( $dbio, $id ) {
        $sql = $this->getEntityQuery( $id );
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $row = mysqli_fetch_row( $result );

            $this->msg = 1;
            $this->entityid = $row[ 0 ];
            $this->entityname = $row[ 1 ];
            $this->entityliverate = $row[ 2 ];
            $this->isactive = $row[ 3 ];
            $this->type = $row[ 4 ];
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn( $dbconn );
    }

    public function addNewEntity( $dbio, $obj ) {
        $sql = "INSERT INTO master_entity (entity_type, entity_id, entity_name, entity_liverate, entity_outstandingtype, entity_pan, entity_country, 
            entity_state, entity_city, entity_address1, entity_address2, entity_address3, entity_phoneno, 
            entity_mobileno, entity_active, entity_email, entity_createdby, entity_createdat, entity_updatedby, 
            entity_updatedat, entity_controlingbranch, entity_alphacode, entity_enquiryemail, entity_swiftemail, entity_scope) 
            SELECT 'A', (SELECT COALESCE(MAX(entity_id), 0)+1 FROM master_entity), '".$obj->entityname."', ".$obj->ratestatus.", '".$obj->type."' ,
            '', 0, 0, 0, '', '', '', '', '', ".$obj->entityactive.", '', 1,NOW(), 1, NULL, 0, '','',  '', ''";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $this->msg = 1;
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn( $dbconn );
    }

    public function editEntity( $dbio, $obj ) {
        $sql = "UPDATE master_entity SET entity_name = '".$obj->entityname."', entity_liverate = ".$obj->ratestatus.', entity_active = '.$obj->entityactive."
                    , entity_outstandingtype = '".$obj->type."'
                    WHERE entity_id = ".$obj->entityid.'';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $this->msg = 1;
        } else {
            $this->msg = 0;
        }
        $dbio->closeConn( $dbconn );
    }

    public function saveTravellerDetail( $dbio, $obj ) {
        $savetype = 'Drafted';
        $sql = "UPDATE corp_leads SET cl_name = '".$obj->name."', cl_adhaarno = '".$obj->adhaar."', cl_passport = '".$obj->pasport."',
                    cl_requesteddate = '".$obj->deliverydate."', cl_deliverytime = '".$obj->deliverytime."', cl_corpempcode = '".$obj->corpempcode."'
                    , cl_tp_no = '".$obj->corptpcode."' , cl_mobile = '".$obj->mobile."' ";
        if ( $obj->savetype == 'S' ) {
            $sql = $sql.', cl_status = 4';
            $savetype == 'Saved';
        }
        if ( $_SESSION[ 'isRequestPaymentLink' ] == '1' && $obj->filterRequestPaymentLink ) {
            $sql .= " , corp_bankcode ='".$obj->bankCode."' ,corp_accno = '".$obj->accNo."' , corp_ifsc = '".$obj->accIfsc."' , corp_request_payment = 1 ,corp_payment_user_email = '".$obj->userEmail."' ";
        }
        $sql = $sql."  WHERE cl_orderno = '".$obj->orderno."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $this->msg = 1;
        } else {
            $this->msg = 0;
        }
        $qry = '';
        foreach ( $obj->docList as $item ) {
            if ( $item->doc_filename == '' ) continue;
            $qry = $qry." delete from lead_req_document where doc_filename = '".$item->doc_filename."' and doc_orderno = '".$obj->orderno."';
                insert into lead_req_document(doc_orderno, doc_name, doc_id, doc_filename, doc_ext, doc_uploadedat)
                VALUES ('".$obj->orderno."', '".$item->m_documents."', ".$item->docid.", '".$item->doc_filename."', '".$item->doc_ext."', now());";
        }
        if ( $qry != '' ) {
            $result = $dbio->batchQueries( $dbconn, $qry );
        }

        $sql2 = "INSERT INTO master_order_log(lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code)
            SELECT ".$_SESSION[ 'userSrno' ].", NOW(), '".$obj->orderno."', 'Traveller Details ".$savetype."', 'CORPORATE' ";
        $result2 = $dbio->getSelect( $dbconn, $sql2 );
        $dbio->closeConn( $dbconn );
    }

    public function getOrderHistory( $dbio, $orderno, $externalsource = '' ) {
        $sql = "SELECT cl_orderno, cl_ordertype, cl_name, cl_passport, cl_adhaarno, ml_branch, mcs_statusname, date_format(cl_timestamp, '%d-%m-%Y') as cl_timestamp
                    , DATE_FORMAT(cl_requesteddate, '%d-%m-%Y') as cl_requesteddate, cl_deliverytime, cl_gst, cl_totalinr, cl_totalinvoice, COALESCE(db_name, ''), 
                    COALESCE(DATE_FORMAT(cl_scheduledate, '%d-%m-%Y'), ''), COALESCE(DATE_FORMAT(cl_deliverydate, '%d-%m-%Y'), '')
                    , COALESCE(doc_filename,''), COALESCE(doc_ext,''), cl_corpsrno
                    , cl_cancelreason, cl_invoice_num, cl_remark, COALESCE(cl_other_charges, 0) AS cl_other_charges, cl_corpempcode
                    , cl_tp_no , cl_mobile 
                    FROM corp_leads
                    LEFT OUTER JOIN master_deliveryboy ON db_srno = cl_deliveryboy
                    LEFT OUTER JOIN master_location ON ml_branchcd = cl_branchcd
                    LEFT OUTER JOIN master_corp_status ON cl_status = mcs_srno
                    LEFT OUTER JOIN 
                    (SELECT doc_ext, doc_orderno, doc_filename FROM lead_req_document WHERE doc_filename LIKE ('INVOICE%')) AS t ON t.doc_orderno = cl_orderno
                    WHERE cl_orderno = '".$orderno."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            $row = mysqli_fetch_row( $result );
            $this->orderno = $row[ 0 ];
            $this->ordertype = $row[ 1 ];
            $this->name = $row[ 2 ];
            $this->passport = $row[ 3 ];
            $this->adhaar = $row[ 4 ];
            $this->branch = $row[ 5 ];
            $this->status = $row[ 6 ];
            $this->date = $row[ 7 ];
            $this->reqdate = $row[ 8 ];
            $this->deltime = $row[ 9 ];
            $this->gst = $row[ 10 ];
            $this->inr = $row[ 11 ];
            $this->totalinvoice = $row[ 12 ];
            $this->delboy = $row[ 13 ];
            $this->scheduledate = $row[ 14 ];
            $this->deliverydate = $row[ 15 ];
            $this->filename = $row[ 16 ];
            $this->ext = $row[ 17 ];
            $this->corpsrno = $row[ 18 ];
            $this->cancelreason = $row[ 19 ];
            $this->invoicenum = $row[ 20 ];
            $this->remark = $row[ 21 ];
            $this->othercharge = $row[ 22 ];
            $this->empcode = $row[ 23 ];
            $this->tpcode = $row[ 24 ];
            $this->mobile = $row[ 25 ];
        }

        $qry = "SELECT cp_ordertype, cp_product, isd_name, cp_quantity, cp_exchangerate, cp_totalinr, cp_cardvalue FROM corp_product
                    LEFT OUTER JOIN master_isd ON cp_isdcode = isd_code
                    WHERE cp_orderno = '".$orderno."'";
        $result1 = $dbio->getSelect( $dbconn, $qry );
        if ( mysqli_num_rows( $result1 )>0 ) {
            while( $row = mysqli_fetch_assoc( $result1 ) ) {
                $this->productlist[] = $row;
            }
        } else {
            $this->productlist = array();
        }
        $dbio->closeConn( $dbconn );
        if ( $externalsource == 'external' ) {
            $this->commentlog = array();
        } else {
            $this->commentlog = $this->getCommentLog( $dbio, $orderno );
        }
    }

    public function getActivityLogData( $dbio, $orderno ) {
        $logdata = array();
        $sql1 = "SELECT user_name, lg_desc, date_format(lg_logtime, '%d-%m-%Y %h:%i:%s') as lg_logtime_ymd FROM master_order_log 
                    LEFT OUTER JOIN user_login ON lg_usersrno = user_srno
                    WHERE lg_orderno = '".$orderno."' ORDER BY lg_logtime DESC";
        $dbconn = $dbio->getConn();
        $result1 = $dbio->getSelect( $dbconn, $sql1 );
        if ( mysqli_num_rows( $result1 )>0 ) {
            while( $row = mysqli_fetch_assoc( $result1 ) ) {
                $logdata[] = $row;
            }
        }
        return $logdata;
        $dbio->closeConn( $dbconn );
    }

    public function getCurrentStatus( $dbio, $orderno ) {
        $sql2 = "SELECT cl_status, mcs_statusname FROM corp_leads 
                    LEFT OUTER JOIN master_corp_status ON cl_status = mcs_srno
                    WHERE cl_orderno = '".$orderno."'";
        $dbconn = $dbio->getConn();
        $result2 = $dbio->getSelect( $dbconn, $sql2 );
        if ( mysqli_num_rows( $result2 )>0 ) {
            $row = mysqli_fetch_row( $result2 );
            $this->statuscode = $row[ 0 ];
            $this->statusname = $row[ 1 ];
        }
        $dbio->closeConn( $dbconn );
    }

    private function corpProductData( $dbio, $orderno ) {
        $productlist = array();
        $sql = "SELECT cp_srno, cp_ordertype, cp_product, cp_isdcode, cp_quantity, cp_exchangerate 
            , cp_cardtype, cp_cardbankcode, cp_cardnumber, cp_cardbankcode as cardbank, cp_cardnumber as cardnumber, cp_cardvalue
            , coalesce(cp_withdrawal_type, '') as cp_withdrawal_type
            FROM corp_product WHERE cp_orderno = '".$orderno."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( mysqli_num_rows( $result )>0 ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $productlist[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );
        return $productlist;
    }

    public function  getBackOfcData( $dbio, $orderno ) {
        $sql = 'SELECT mcs_srno, mcs_statusname FROM master_corp_status';
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $this->statuslist[] = $row;
            }
        }

        $sql2 = "SELECT cl_status, mcs_statusname, cl_name, cl_passport, cl_adhaarno, ml_branch, cl_orderno, DATE_FORMAT(cl_timestamp, '%d-%m-%Y') as cl_timestamp
                    , cl_totalinr, cl_gst, cl_totalinvoice, DATE_FORMAT(cl_requesteddate, '%d-%m-%Y') as cl_requesteddate, cl_deliverytime, 
                    COALESCE(cl_deliveryboy, '') as cl_deliveryboy ,COALESCE(cl_scheduledate, '') as cl_scheduledate, COALESCE(db_name, '') as db_name, 
                    COALESCE(cl_deliverydate, '') as cl_deliverydate,
                    COALESCE(DATE_FORMAT(cl_scheduledate, '%d-%m-%Y'), '') AS cl_scheduledateview, 
                    COALESCE(DATE_FORMAT(cl_deliverydate, '%d-%m-%Y'), '') AS cl_deliverydateview
                    ,coalesce(doc_ext,''), coalesce(doc_filename, ''), cl_corpsrno
                    , cl_cancelreason, DATE_FORMAT(cl_canceldate, '%d-%m-%Y')
                    , cl_invoice_num, cl_remark, coalesce(cl_other_charges,0) as cl_other_charges, cl_corpempcode , coalesce(corp_request_payment,0) , cl_mobile 
                    FROM corp_leads 
                    LEFT OUTER JOIN lead_req_document ON doc_orderno = cl_orderno
                    LEFT OUTER JOIN master_corp_status ON cl_status = mcs_srno
                    LEFT OUTER JOIN master_deliveryboy ON cl_deliveryboy = db_srno
                    LEFT OUTER JOIN master_location ON cl_branchcd = ml_branchcd
                    WHERE cl_orderno = '".$orderno."'";
        $result2 = $dbio->getSelect( $dbconn, $sql2 );
        if ( mysqli_num_rows( $result2 )>0 ) {
            $row = mysqli_fetch_row( $result2 );
            $this->statussrno = $row[ 0 ];
            $this->status = $row[ 1 ];
            $this->name = $row[ 2 ];
            $this->passport = $row[ 3 ];
            $this->adhaar = $row[ 4 ];
            $this->branch = $row[ 5 ];
            $this->orderno = $row[ 6 ];
            $this->date = $row[ 7 ];
            $this->totalinr = $row[ 8 ];
            $this->gst = $row[ 9 ];
            $this->totalinvoice = $row[ 10 ];
            $this->reqdate = $row[ 11 ];
            $this->reqtime = $row[ 12 ];
            $this->delcode = $row[ 13 ];
            $this->scheduledate = $row[ 14 ];
            $this->delname = $row[ 15 ];
            $this->deliverydate = $row[ 16 ];
            $this->dmyscheduledate = $row[ 17 ];
            $this->dmydeliverydate = $row[ 18 ];
            $this->entityid = $row[ 21 ];
            $this->cancelreason = $row[ 22 ];
            $this->canceldate = $row[ 23 ];
            $this->invoicenum = $row[ 24 ];
            $this->remark = $row[ 25 ];
            $this->othercharge = $row[ 26 ];
            $this->empcode = $row[ 27 ];
            $this->sendpaymentlink = $row[ 28 ];
            $this->mobile = $row[ 29 ];
        }

        // $sql3 = "SELECT cp_srno, cp_ordertype, cp_product, cp_isdcode, cp_quantity, cp_exchangerate 
            // , cp_cardtype, cp_cardbankcode, cp_cardnumber, cp_cardbankcode as cardbank, cp_cardnumber as cardnumber
            // FROM corp_product WHERE cp_orderno = '".$orderno."'";
        // $result3 = $dbio->getSelect( $dbconn, $sql3 );
        // if ( mysqli_num_rows( $result3 )>0 ) {
        //     while( $row = mysqli_fetch_assoc( $result3 ) ) {
        //         $this->productlist[] = $row;
        //     }
        // } else {
        //     $this->productlist = array();
        // }

        $sql4 = "SELECT entity_liverate FROM master_entity WHERE entity_id = (SELECT max(cl_corpsrno) FROM corp_leads WHERE cl_orderno = '".$orderno."')";
        $result4 = $dbio->getSelect( $dbconn, $sql4 );
        if ( mysqli_num_rows( $result4 )>0 ) {
            $row = mysqli_fetch_row( $result4 );
            $this->liverate = $row[ 0 ];
        }

        // $sql5 = "SELECT rem_timestamp, rem_desc, user_name FROM master_order_remark
            //         LEFT OUTER JOIN user_login ON rem_userSrno = user_srno
            //         WHERE rem_orderno = '".$orderno."' ORDER BY rem_timestamp DESC";
        // $result5 = $dbio->getSelect( $dbconn, $sql5 );
        // if ( mysqli_num_rows( $result5 )>0 ) {
        //     while( $row = mysqli_fetch_assoc( $result5 ) ) {
        //         $this->commentlog[] = $row;
        //     }
        // } else {
        //     $this->commentlog = array();
        // }

        $sql7 = 'SELECT db_srno, db_name, db_mobile, db_branch FROM master_deliveryboy WHERE db_active = 1 ';
        $result7 = $dbio->getSelect( $dbconn, $sql7 );
        if ( mysqli_num_rows( $result7 )>0 ) {
            while( $row = mysqli_fetch_assoc( $result7 ) ) {
                $this->deliveryboylist[] = $row;
            }
        } else {
            $this->deliveryboylist = array();
        }

        $sql6 = "SELECT cl_status, mcs_statusname, cl_name, cl_passport, cl_adhaarno, ml_branch FROM corp_leads 
                    LEFT OUTER JOIN master_corp_status ON cl_status = mcs_srno
                    LEFT OUTER JOIN master_location ON cl_branchcd = ml_branchcd
                    WHERE cl_orderno = '".$orderno."'";
        $dbio->closeConn( $dbconn );
        $this->productlist = $this->corpProductData( $dbio, $orderno );
        $this->commentlog = $this->getCommentLog( $dbio, $orderno );
    }

    public function updateOrderStatus( $dbio, $obj ) {
        $sql = 'UPDATE corp_leads SET cl_status = '.$obj->status.' ';
        if ( $obj->status == '2' ) {
            //delivered
            $sql = $sql." , cl_scheduledate = CASE WHEN cl_scheduledate IS NULL then '".$obj->deliverydate."' else cl_scheduledate end ";
            $sql = $sql." , cl_deliverydate = '".$obj->deliverydate."', cl_invoice_num = '".$obj->invoiceNumber."', cl_remark = '".$obj->deliveryRemark."' ";
        } else if ( $obj->status == '5' ) {
            // delivery schedule
            $sql = $sql.", cl_deliveryboy = '".$obj->deliveryboy."', cl_scheduledate = '".$obj->scheduledate."'";
        } else if ( $obj->status == '6' ) {
            // cancelled
            $sql = $sql.", cl_canceldate = now(), cl_cancelreason = '".$obj->cancelReason."' ";
        } else {
            $sql = $sql.', cl_deliveryboy = NULL, cl_scheduledate = NULL, cl_deliverydate = NULL ';
        }
        $sql = $sql." WHERE cl_orderno = '".$obj->orderno."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $this->msg = 1;
            $this->status = $obj->status;
            $this->delboy = $obj->deliveryboy;
            $this->scheduledate = $obj->scheduledate;
        }
        $cardlog = 0;
        if ( $obj->status == '2' ) {
            foreach ( $obj->productList as $item ) {
                if ( $item->cp_product == 'CARD' and $item->cp_cardtype == 'N' ) {
                    $qry = 'update corp_product set cp_cardbankcode = '.$item->cardbank.", cp_cardnumber = '".$item->cardnumber."' where cp_orderno = '".$obj->orderno."'
                        and cp_srno = ".$item->cp_srno.'';
                    $result = $dbio->getSelect( $dbconn, $qry );
                    $cardlog = 1;
                } else {
                    continue;
                }
            }
        }
        if ( $cardlog == 1 ) {
            $sql2 = "INSERT INTO master_order_log(lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code)
                SELECT ".$_SESSION[ 'userSrno' ].", NOW(), '".$obj->orderno."'
                , 'Card Details Added', 'CORPORATE' ";
            $result2 = $dbio->getSelect( $dbconn, $sql2 );
        }
        $sql3 = "INSERT INTO master_order_log(lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code)
                SELECT ".$_SESSION[ 'userSrno' ].", NOW(), '".$obj->orderno."'
                , CONCAT('Status Updated to ', (SELECT mcs_statusname FROM master_corp_status WHERE mcs_srno = ".$obj->status.")), 'CORPORATE' ";
        $result3 = $dbio->getSelect( $dbconn, $sql3 );
        $dbio->closeConn( $dbconn );
    }

    public function saveChangedRates( $dbio, $productList, $obj ) {
        $str = '';
        foreach ( $productList as $item ) {
            $item->cardbank = $item->cardbank == '' ? 0 : $item->cardbank;
            $item->cp_cardvalue = $item->cp_cardvalue == '' ? 0 : $item->cp_cardvalue;
            $cardvalue = $item->cp_cardvalue == '' ? 0 : $item->cp_cardvalue;
            if ( $item->cp_product == 'CN' ) $cardvalue = 1;
            $str = $str.''.$item->cp_isdcode.':'.$item->cp_exchangerate.'   ';
            $sql = ' UPDATE corp_product SET cp_exchangerate = '.$item->cp_exchangerate.', cp_totalinr = '.$item->cp_exchangerate*$item->cp_quantity*$cardvalue."  
                ,cp_cardbankcode = ".$item->cardbank.", cp_cardnumber = '".$item->cardnumber."', cp_cardvalue = ".$item->cp_cardvalue."
                WHERE cp_srno = ".$item->cp_srno.'; ';
            $dbconn = $dbio->getConn();
            $result = $dbio->getSelect( $dbconn, $sql );
            $dbio->closeConn( $dbconn );
        }
        $str = $str.'OtherCharges: '.$obj->otherCharges;
        $sql = 'UPDATE corp_leads SET cl_totalinr = '.$obj->totalinr.', cl_gst='.$obj->gst.', cl_totalinvoice = '.$obj->totalinvoice."
            , cl_status = CASE WHEN cl_status = 3 THEN 1 ELSE cl_status END 
                , cl_other_charges  = ".$obj->otherCharges." 
                WHERE cl_orderno ='".$obj->orderno."'";
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect( $dbconn, $sql );

        $qry = "INSERT INTO master_order_log (lg_usersrno, lg_logtime, lg_orderno, lg_desc, lg_activity_code) 
                SELECT ".$_SESSION[ 'userSrno' ].", NOW(), '".$obj->orderno."', CONCAT('Rate Added ', '".$str."'), 'CORPORATE'";
        $result = $dbio->getSelect( $dbconn, $qry );
        $dbio->closeConn( $dbconn );
        $this->msg = 1;
        $this->totalinr = $obj->totalinr;
        $this->gst = $obj->gst;
        $this->totalinvoice = $obj->totalinvoice;
        $this->productlist = $this->corpProductData( $dbio, $obj->orderno );
    }

    public function addComment( $dbio, $obj ) {
        $commentdata = array();
        $sql = "INSERT INTO master_order_remark (rem_userSrno, rem_orderno, rem_timestamp, rem_desc) 
            SELECT ".$_SESSION[ 'userSrno' ].", '".$obj->orderno."', NOW(), '".$obj->comment."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $dbio->closeConn( $dbconn );
        return $this->getCommentLog( $dbio, $obj->orderno );
    }

    private function getCommentLog( $dbio, $orderno ) {
        $qry = "SELECT date_format(rem_timestamp, '%d-%m-%Y %h:%m:%s') as rem_timestamp, rem_desc, user_name FROM master_order_remark
                    LEFT OUTER JOIN user_login ON rem_userSrno = user_srno
                    WHERE rem_orderno = '".$orderno."' and rem_userSrno = ".$_SESSION[ 'userSrno' ].' ORDER BY rem_timestamp DESC';
        $dbconn = $dbio->getConn();
        $res = $dbio->getSelect( $dbconn, $qry );
        $commentdata = array();
        if ( mysqli_num_rows( $res )>0 ) {
            while( $row = mysqli_fetch_assoc( $res ) ) {
                $commentdata[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );
        return $commentdata;
    }

    public function getDocsToUpload( $dbio, $orderno ) {
        $doclist = array();
        $sql = "SELECT cl_ordertype FROM corp_leads WHERE cl_orderno = '".$orderno."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            $row = mysqli_fetch_row( $result );
            $sql_2 = "SELECT docid, m_documents
                    , coalesce(doc_filename, '') AS doc_filename
                    , COALESCE(doc_orderno,'') AS doc_orderno
                    , COALESCE(doc_ext,'') AS doc_ext  
                    FROM master_purpose_doc_link 
                        LEFT OUTER JOIN master_document ON docid = m_srno
                        LEFT OUTER JOIN 
                            (SELECT doc_filename, doc_id, doc_orderno, doc_ext FROM lead_req_document WHERE doc_orderno = '".$orderno."') AS t ON doc_id = docid
                    WHERE 1=1 ";

            if ( $row[ 0 ] == 'BUY' ) {
                $sql_2 = $sql_2.' AND purposeid = 999991';
            } else {
                $sql_2 = $sql_2.' AND purposeid = 999992';
            }
            $sql_2 = $sql_2.' order by docid ';
            $res = $dbio->getSelect( $dbconn, $sql_2 );
            if ( mysqli_num_rows( $res )>0 ) {
                while( $row = mysqli_fetch_assoc( $res ) ) {
                    $doclist[] = $row;
                }
            }
        }
        return $doclist;
        $dbio->closeConn( $dbconn );
    }

    private function getLoaQuery( $obj ) {
        $sql = 'select entity_loa, entity_loa_ext from master_entity where entity_id = '.$obj->corpSrno.' ';
        return $sql;
    }

    public function viewLOA( $dbio, $obj ) {
        $doc_desc = '';
        $doc_ext = '';
        $doc_filename = '';
        $typ = '';
        $bs64 = '';
        $isok = true;
        $msg = '';
        $sql = $this->getLoaQuery( $obj );
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            while( $row = mysqli_fetch_row( $result ) ) {
                $doc_desc = 'LOA';
                $doc_filename = $row[ 0 ];
                $doc_ext = $row[ 1 ];
            }
        }
        $dbio->closeConn( $dbconn );
        if ( !file_exists( ENTITYDOCSPATH.$doc_filename ) ) {
            $isok = false;
            $msg = 'File does not exist';
        } else {
            if ( $doc_ext == 'jpg' ) {
                $typ = 'image/jpg';
                $bs64 = 'data:image/jpg;base64,'.base64_encode( file_get_contents( ENTITYDOCSPATH.$doc_filename ) );
            } elseif ( $doc_ext == 'png' ) {
                $typ = 'image/png';
                $bs64 = 'data:image/png;base64,'.base64_encode( file_get_contents( ENTITYDOCSPATH.$doc_filename ) );
            } elseif ( $doc_ext == 'gif' ) {
                $typ = 'image/gif';
                $bs64 = 'data:image/gif;base64,'.base64_encode( file_get_contents( ENTITYDOCSPATH.$doc_filename ) );
            } elseif ( $doc_ext == 'bmp' ) {
                $typ = 'image/bmp';
                $bs64 = 'data:image/bmp;base64,'.base64_encode( file_get_contents( ENTITYDOCSPATH.$doc_filename ) );
            } elseif ( $doc_ext == 'pdf' ) {
                $typ = 'application/pdf';
                $bs64 = 'data:application/pdf;base64,'.base64_encode( file_get_contents( ENTITYDOCSPATH.$doc_filename ) );
            } else if ( $doc_ext == 'jpeg' ) {
                $typ = 'image/jpeg';
                $bs64 = 'data:image/jpeg;base64,'.base64_encode( file_get_contents( ENTITYDOCSPATH.$doc_filename ) );
            } else if ( $doc_ext == 'jfif' ) {
                $typ = 'application/jfif';
                $bs64 = 'data:application/jfif;base64,'.base64_encode( file_get_contents( ENTITYDOCSPATH.$doc_filename ) );
            } else {
                $typ = 'image/png';
                $bs64 = 'data:image/png;base64,'.base64_encode( file_get_contents( ENTITYDOCSPATH.'fnf.png' ) );
                /// file not found file not available
            }

        }
        echo json_encode( array( 'status'=>$isok, 'typ'=>$typ, 'bs64'=>$bs64, 'desc'=>$doc_desc, 'ext'=>$doc_ext, 'fname'=>$doc_filename, 'msg'=>$msg ) );
    }

    public function downlaodLOA( $dbio, $obj ) {
        $doc_desc = '';
        $doc_ext = '';
        $doc_filename = '';
        $isok = true;
        $msg = '';
        $sql = $this->getLoaQuery( $obj );
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        if ( $result ) {
            while( $row = mysqli_fetch_row( $result ) ) {
                $doc_desc = 'LOA';
                $doc_filename = $row[ 0 ];
                $doc_ext = $row[ 1 ];
            }
        }
        $dbio->closeConn( $dbconn );
        // $dbio->writeLog( json_encode( file_exists( ENTITYDOCSPATH.$doc_filename ) ) );
        // $dbio->writeLog( json_encode( file_exists( ENTITYDOCSPATH.$doc_filename ) ) );
        $dbio->writeLog( json_encode( ENTITYDOCSPATH.$doc_filename ) );

        if ( file_exists( ENTITYDOCSPATH.$doc_filename ) ) {
            header( 'filefound: true' );
            header( 'Content-Description: File Transfer' );
            header( 'Content-Type: application/octet-stream' );
            header( 'Content-Disposition: attachment; filename='.basename( $doc_filename ) );
            header( 'Content-Transfer-Encoding: binary' );
            header( 'Expires: 0' );
            header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
            header( 'Pragma: public' );
            header( 'Content-Length: '.filesize( ENTITYDOCSPATH.$doc_filename ) );
            ob_clean();
            flush();
            readfile( ENTITYDOCSPATH.$doc_filename );
            $msg = 'File Downloaded Succesfully';
            // exit;
        } else {
            $isok = false;
            // http_response_code( 404 );
            header( 'Content-Type: application/json' );
            header( 'filefound: false' );
            ob_clean();
            flush();
            $msg = 'File not found';
        }
        return array( 'status'=>$isok, 'msg'=>$msg );
    }

    public function getEmployeeData( $dbio, $empcode, $ordertype ) {
        $sql = "select concat(cl_name,'^',cl_passport) as value, concat(cl_name,' ',cl_passport) as label, cl_orderno, cl_ordertype FROM corp_leads 
            WHERE cl_corpempcode = '".$empcode."' AND cl_passport != '' ORDER BY cl_srno DESC LIMIT 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $empdata = array();
        $docdata = array();
        $orderno = '';
        if ( mysqli_num_rows( $result )>0 ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $orderno = $row[ 'cl_orderno' ];
                $empdata[] = $row;
            }
        }
        $sql_2 = "SELECT docid, m_documents
                , coalesce(doc_filename, '') AS doc_filename
                , COALESCE(doc_orderno,'') AS doc_orderno
                , COALESCE(doc_ext,'') AS doc_ext  
                FROM master_purpose_doc_link 
                    LEFT OUTER JOIN master_document ON docid = m_srno
                    LEFT OUTER JOIN 
                        (SELECT doc_filename, doc_id, doc_orderno, doc_ext FROM lead_req_document WHERE doc_orderno = '".$orderno."' and doc_id in (1, 2)
                        ORDER BY doc_uploadedat DESC LIMIT 2) AS t ON doc_id = docid
                WHERE 1=1 ";

        if ( $ordertype == 'BUY' ) {
            $sql_2 = $sql_2.' AND purposeid = 999991';
        } else {
            $sql_2 = $sql_2.' AND purposeid = 999992';
        }
        $sql_2 = $sql_2.' ORDER BY docid ';
        $result = $dbio->getSelect( $dbconn, $sql_2 );
        if ( mysqli_num_rows( $result )>0 ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $docdata[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );
        return array( 'empdata'=>$empdata, 'docdata'=>$docdata );
    }

    public function getFileData( $dbio, $obj ) {
        $filename = '';
        $ext = '';
        $qry = "select cl_orderno from corp_leads where cl_corpempcode = '".$obj->empcode."' order by cl_srno limit 1";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $qry );
        $orderno = '';
        if ( mysqli_num_rows( $result )>0 ) {
            $row = mysqli_fetch_row( $result );
            $sql = "select doc_filename, doc_ext, doc_orderno from lead_req_document where doc_orderno = '".$row[ 0 ]."' and doc_id = ".$obj->docid.'';
            $result1 = $dbio->getSelect( $dbconn, $sql );
            if ( mysqli_num_rows( $result1 )>0 ) {
                $row = mysqli_fetch_row( $result1 );
                $filename = $row[ 0 ];
                $ext = $row[ 1 ];
                $orderno = $row[ 2 ];
            }
        }
        $dbio->closeConn( $dbconn );
        return array( 'filename'=>$filename, 'ext'=>$ext, 'orderno'=>$orderno );
    }

    public function getCardDetails( $dbio, $empcode ) {
        $sql = "select CONCAT(cp_cardbankcode,'^',cp_cardnumber) AS value, CONCAT(mcb_bname,' ',cp_cardnumber) as label FROM corp_product 
                left outer join corp_leads ON cl_orderno = cp_orderno
                LEFT OUTER JOIN master_card_bank ON mcb_bsrno = cp_cardbankcode
                WHERE cp_ordertype = 'BUY' AND cp_product = 'CARD' AND cp_ordersave = 1 AND cl_corpempcode = '".$empcode."'";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $carddetails = array( [ 'value'=>'0', 'label'=>'Select' ] );
        if ( mysqli_num_rows( $result )>0 ) {
            while( $row = mysqli_fetch_assoc( $result ) ) {
                $carddetails[] = $row;
            }
        }
        $dbio->closeConn( $dbconn );
        return $carddetails;
    }

    public function validate_user( $dbio, $cl_unique_key_mail_identifier ) {
        $date = date( 'Y-m-d H:i:s' );
        $resp = '0';
        $sql = "select * from corp_leads where cl_unique_key_mail_identifier = '".$cl_unique_key_mail_identifier."' 
            AND ((cl_email_timestamp + INTERVAL 2 DAY) >'".$date."' and cl_sendmail = 1) ;";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $dbio->closeConn( $dbconn );
        if ( mysqli_num_rows( $result )>0 ) {
            $resp = '1' ;
        }
        return $resp;
    }

    public function resendEmail( $dbio, $ordersrno ) {
        $resp = '0';
        $sql = "UPDATE corp_leads set CL_email_timestamp = now() ,cl_sendmail = 1 where cl_orderno = '".$ordersrno."' ;";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $dbio->closeConn( $dbconn );
        if ( $result ) {
            $resp = '1' ;
        }
        return $resp;
    }

    public function ExpireLink( $dbio, $ordersrno ) {
        $resp = 0;
        $sql = "UPDATE corp_leads set cl_sendmail = 0 where cl_orderno = '".$ordersrno."' ;";
        $dbconn = $dbio->getConn();
        $result = $dbio->getSelect( $dbconn, $sql );
        $dbio->closeConn( $dbconn );
        if ( $result ) {
            $resp = '1' ;
        }
        return $resp;
    }

    public function getLeadUploadFormet( $dbio, $obj ) {
        $isosk = true;
        $msg = '';
        $lineNum = 1;
        $fileName = '';
        $fileName = 'LeadFormat';
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load( DIRPATH . 'template\\LeadFormat.xlsx' );

        $filePath = TEMPPATH . $fileName . '.xlsx';
        $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter( $spreadsheet, 'Xlsx' );
        $writer->save( $filePath );
        if ( file_exists( $filePath ) ) {
            header( 'filefound: true' );
            header( 'Content-Description: File Transfer' );
            header( 'Content-Type: application/octet-stream' );
            header( 'Content-Disposition: attachment; filename=' . basename( $fileName . '.xlsx' ) );
            header( 'Content-Transfer-Encoding: binary' );
            header( 'Expires: 0' );
            header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
            header( 'Pragma: public' );
            header( 'Content-Length: ' . filesize( TEMPPATH . $fileName . '.xlsx' ) );
            ob_clean();
            flush();
            $msg = 'File Downloaded successfully.';
            readfile( TEMPPATH . $fileName . '.xlsx' );
            exit;
        } else {
            $msg = 'File not Found.';
            header( 'filefound: false' );
            ob_clean();
            flush();
        }
        return array( 'status'=>$isok, 'msg'=>$msg );
    }

    public function errorUploadData( $dbio, $obj ) {
        $tableData = $obj;
        // Assuming $obj is an array of rows ( associative arrays )
        $format = '<html>';
        $format .= "<body style='font-family: \"Times New Roman\";'>";
        $format .= "
            <div style='margin-inline: 15%;'>
                <div style='background-color: white;'>
                    <br />
                </div>
                <br/>
                <center style='padding-bottom'>
                    <h1 style ='background-color:#d8bae0;'><p>Lead Upload Data Error List</h1><br />
                </center>
                <br/><div>
                <table width='100%' style='border: 2px solid black; border-collapse: collapse; font-size: 15px; text-align: center;'>
        ";
        if ( count( $tableData ) > 0 ) {
            $format .= '<thead>';
            $format .= '<tr>';
            $format .= "<th style='border: 2px solid black; padding: 0.5px; background-color: #f2f2f2;'>Description</th>";
            $format .= "<th style='border: 2px solid black; padding: 0.5px; background-color: #f2f2f2;'>Row</th>";
            $format .= "<th style='border: 2px solid black; padding: 0.5px; background-color: #f2f2f2;'>Column</th>";
            $format .= '</tr>';
            $format .= '</thead>';

            $format .= '<tbody>';
            foreach ( $tableData as $row ) {
                $format .= '<tr>';
                foreach ( $row as $key => $value ) {
                    $format .= "<td style='border: 2px solid black; padding: 0.5px;'>$value</td>";
                }
                $format .= '</tr>';
            }
            $format .= '</tbody>';
        }

        $format .= '</table></div>';
        $format .= '</div>';
        $format .= '</body>';
        $format .= '</html>';
        $dbio->writeLog( $format );
        echo $format;
    }
}
?>