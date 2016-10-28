<?php
require 'PHPMailer/PHPMailerAutoload.php';

if(isset($_GET['msg'])){
    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'parakrationofficial@gmail.com';
    $mail->Password = 'paralgskration1';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->setFrom('parakrationofficial@gmail.com');
    $mail->addAddress('parakrationofficial@gmail.com');
    $mail->isHTML(true);
    $mail->Subject = "Feedback from ".$_GET['name'];
    $mail->Body = '<b>'.$_GET['email'].'</b><br><br>'.$_GET['msg'];
    if($mail->send()) echo "Thank you for your feedback";
    else echo "There was an internal problem. Please try again";
}

?>
