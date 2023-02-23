<?php

// include google API client
require_once "vendor/autoload.php";

// set google client ID
$google_oauth_client_id = "";

// create google client object with client ID
$client = new Google_Client([
	'client_id' => "699278121565-mp5qevri37pjnueollo755hdnjbqocrm.apps.googleusercontent.com"
]);

// verify the token sent from AJAX
$id_token = $_POST["id_token"];

$payload = $client->verifyIdToken($id_token);
if ($payload && $payload['aud'] == $google_oauth_client_id)
{
	// get user information from Google
	$user_google_id = $payload['sub'];

	$name = $payload["name"];
	$email = $payload["email"];
	$picture = $payload["picture"];

	// send the response back to client side
	echo json_encode([
		"status" => "success"
	]);
}
else
{
	// token is not verified or expired
	echo json_encode([
		"status" => "error"
	]);
}