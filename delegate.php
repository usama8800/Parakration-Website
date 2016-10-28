<?php
	try{
		require_once "Twig/Autoloader.php";
		Twig_Autoloader::register();
		$loader = new Twig_Loader_Filesystem('templates');
		$twig = new Twig_Environment($loader);
		if(isset($_GET['num'])) {
			$num = $_GET['num'];
			echo $twig->display('/blocks/delegate.twig', array('num'=>$num));
		}else {
			echo 'num not set';
			exit;
		}
	} catch(Twig_Error_Loader $e){
		echo $e;
		exit;
	}
?>
