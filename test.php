<?php
require 'PHPMailer/PHPMailerAutoload.php';
error_reporting(E_ERROR | E_WARNING | E_PARSE);

function print_array($array){
    $str = "";
    for($i = 0; $i < count($array); $i++){
        if($i==0) $str = $array[$i];
        else {
            if($i+1==count($array)) $str = $str." and ".$array[$i];
            else $str = $str.", ".$array[$i];
        }
    }
    return $str;
}

$mail = new PHPMailer;
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'parakrationofficial@gmail.com';
$mail->Password = 'paralgskration';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;
$mail->setFrom('parakrationofficial@gmail.com');
$mail->addAddress('parakrationofficial@gmail.com');
$mail->isHTML(true);
$mail->Subject = "'Team Name' Registered";
$mail->Body = $msg;
$mail->send();
?>
