<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);

$pics_dir = "uploads/";
$error = array();
$upload_errs = array();

require_once "Twig/Autoloader.php";
require 'PHPMailer/PHPMailerAutoload.php';
Twig_Autoloader::register();
$loader = new Twig_Loader_Filesystem('templates');
$twig = new Twig_Environment($loader);

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

if(isset($_POST['id'])){
	$id = $_POST['id'];
	$error['submitted'] = $id;
	$array = array_values($_FILES);
	for ($i = 0; $i < count($_FILES); $i++) {
		$target_file = $pics_dir . basename($array[$i]["name"]);
		$imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
		$target_file = $pics_dir . $id . '-member-' . ($i+1) . '.png';
		$check = getimagesize($array[$i]["tmp_name"]);
		if($check !== false) {
			if(!move_uploaded_file($array[$i]["tmp_name"], $target_file)){
				array_push($upload_errs, $array[$i]['name']);
			}
		} else {
			array_push($upload_errs, $array[$i]['name']);
		}
	}
	try{
		$mysqli = mysqli_connect("localhost", "krationp_ara", "IUPOJ^FUH0I!", "krationp_ara");
		if ($mysqli->connect_errno) throw new Exception("ce");
		
        $events = array();
        $events[] = $_POST['event-1'];
        $events[] = $_POST['event-2'];
        $events[] = $_POST['event-3'];
		if(!$stmt = $mysqli->prepare("INSERT INTO `teams` VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
			throw new Exception($mysqli->error);
		}
		$stmt->bind_param('ssssssssi', $id, $team_name, $team_branch, $team_email, $team_address, $team_event_1, $team_event_2, $team_event_3, $team_accomodations);
		$team_name = $_POST['institution-name'];
		$team_branch = $_POST['institution-branch'];
		$team_email = $_POST['institution-email'];
		$team_address = $_POST['institution-address'];
		$team_event_1 = $_POST['event-1'];
		$team_event_2 = $_POST['event-2'];
		$team_event_3 = $_POST['event-3'];
		$team_accomodations = $_POST['institution-accomodations']=='Yes';
		$stmt->execute();
		
		$sa_name = $_POST['staff-advisor-name'];
		$sa_number = $_POST['staff-advisor-number'];
		$sa_email = $_POST['staff-advisor-email'];
		$sa_nic = $_POST['staff-advisor-nic'];
		if(!empty($sa_name) || !empty($sa_number) || !empty($sa_email) || !empty($sa_nic)) {
			if(!$stmt = $mysqli->prepare("INSERT INTO `staff_advisors` VALUES (?, ?, ?, ?, ?)")){
				throw new Exception($mysqli->error);
			}
			$stmt->bind_param('issss', $id, $sa_name, $sa_email, $sa_number, $sa_nic);
			$stmt->execute();
		}
		
		if(!$stmt = $mysqli->prepare("INSERT INTO `delegates` VALUES (?, ?, ?, ?, ?, ?, ?)")){
			throw new Exception($mysqli->error);
		}
		$stmt->bind_param('sssssis', $d_id, $d_name, $d_pic, $d_number, $d_email, $d_isHead, $id);
		for($i = 0; $i < count($_FILES); $i++){
			$num = $i+1;
			$d_id = $id . '-member-'. $num;
			$d_name = $_POST['delegate-' . $num . '-name'];
			$d_pic = $id . '-member-'. $num;
			$d_number = $_POST['delegate-' . $num . '-number'];
			$d_email = $_POST['delegate-' . $num . '-email'];
			$d_isHead = $i == 0 ? 1 : 0;
			$stmt->execute();
		}
        
        $msg = "It has ".count($_FILES)." delegate(s) participating in ".print_array($events)."<br><br>Head Delegate is '".$_POST['delegate-1-name']."': ".$_POST['delegate-1-number']." ".$_POST['delegate-1-email'];
        $email = "parakrationofficial@gmail.com";
        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $email;
        $mail->Password = 'paralgskration1';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->isHTML(true);
        $mail->setFrom($email);
        $mail->addAddress($email);
        $mail->Subject = "'".$team_name."' Registered";
        $mail->Body = $msg;
        $mail->send();
	}catch(Exception $e){
		$message = $e->getMessage();
		if($message == '') $message = 'error';
		$error['database_error'] = $message;
	}
}

$error['upload_errs'] = $upload_errs;
echo $twig->display('register.html', $error);
?>