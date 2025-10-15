<?php
// Uključivanje PHPMailer fajlova
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// ... (require PHPMailer fajlova) ...
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Check if data was sent via the POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize (clean) input data
    $name = htmlspecialchars(strip_tags(trim($_POST['name']))); 
    $email = htmlspecialchars(strip_tags(trim($_POST['email']))); 
    $message = htmlspecialchars(strip_tags(trim($_POST['message']))); 
    
    // --- NOVO: Dohvatanje odabrane usluge ---
    $service = htmlspecialchars(strip_tags(trim($_POST['service']))); 
    
    // Basic validation check - SADA UKLJUČUJE I $service
    if (empty($name) || empty($email) || empty($message) || empty($service) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400); // Bad Request
        
        // ENGLISH RESPONSE 
        echo "Please ensure all required fields, including the service selection, are filled out correctly."; 
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // ... (SMTP SERVER SETTINGS - BEZ PROMENA) ...
        $mail->isSMTP();
        $mail->Host       = 'mail.G4-CONSTRUCTION.com'; // REPLACE
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@G4-CONSTRUCTION.com';   // REPLACE
        $mail->Password   = 'YOUR_EMAIL_PASSWORD';     // REPLACE
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
        $mail->Port       = 587; 
        $mail->CharSet    = 'UTF-8'; 
        
        // ... (Recipient i Reply-To - BEZ PROMENA) ...
        $mail->setFrom('info@G4-CONSTRUCTION.com', 'G4 Website Form'); 
        $mail->addAddress('info@G4-CONSTRUCTION.com', 'G4 Construction'); 
        $mail->addReplyTo($email, $name);

        // --- PROMENA: SUBJECT SADA UKLJUČUJE ODABRANU USLUGU ---
        $mail->Subject = "NEW INQUIRY (" . $service . ") | From: " . $name;
        
        // Email Body (sada uključuje i informaciju o usluzi)
        $mail->isHTML(false); 
        $mail->Body    = "A new message has been received from the G4 Construction website contact form. \n\n" . 
                         "--- Inquiry Details ---\n" .
                         "Name: " . $name . "\n" . 
                         "Email: " . $email . "\n" .
                         "Service Requested: " . $service . "\n" . // NOVO: Dodata usluga u telo
                         "-------------------------\n\n" .
                         "Message:\n" . $message;

        $mail->send();
        
        // SUCCESS: Redirect user
        header("Location: contact.html?status=success"); 
        exit();

    } catch (Exception $e) {
        // ERROR: Redirect user
        header("Location: contact.html?status=error"); 
        exit();
    }

} else {
    // If not sent via POST method
    http_response_code(405); 
    echo "Direct access to this script is not allowed."; 
}
?>