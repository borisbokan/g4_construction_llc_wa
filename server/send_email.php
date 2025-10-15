<?php
// Include PHPMailer files
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// If you manually downloaded the files (common on shared hosting without Composer):
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


// Check if data was sent via the POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize (clean) input data
  $name = htmlspecialchars(strip_tags(trim($_POST['name']))); 
  $email = htmlspecialchars(strip_tags(trim($_POST['email']))); 
  $message = htmlspecialchars(strip_tags(trim($_POST['message']))); 

    // Basic validation check
    if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400); // Bad Request
        
        // ENGLISH RESPONSE for immediate error (e.g., if one field is empty)
        echo "Please ensure all required fields are filled out correctly."; 
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // SMTP SERVER SETTINGS (REPLACE ALL PLACEHOLDERS!)
        // Use G4 Construction's professional email details
        $mail->isSMTP();
        $mail->Host       = 'mail.G4-CONSTRUCTION.com'; // REPLACE: SMTP server address (Ask hosting provider)
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@G4-CONSTRUCTION.com';   // REPLACE: G4 Construction's outgoing email address
        $mail->Password   = 'YOUR_EMAIL_PASSWORD';     // REPLACE: Password for that email account
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Usually STARTTLS
        $mail->Port       = 587; // Usually 587 for TLS/STARTTLS
        $mail->CharSet    = 'UTF-8'; 
        
        // --- EMAIL CONTENT SETUP ---
        
        // Sender: MUST BE THE SAME AS $mail->Username for SMTP authentication
        $mail->setFrom('info@G4-CONSTRUCTION.com', 'G4 Website Form'); 
        
        // Recipient: G4 Construction's main contact address
        $mail->addAddress('info@G4-CONSTRUCTION.com', 'G4 Construction'); // REPLACE: G4's receiving email

        // Reply-To: Set to the visitor's email so you can hit 'Reply' directly
        $mail->addReplyTo($email, $name);

        // Subject Line (Email Metadata)
        $mail->Subject = "NEW WEBSITE INQUIRY | From: " . $name;
        
        // Email Body (Email Metadata)
        $mail->isHTML(false); // Plain text email is often better for form submissions
        $mail->Body    = "A new message has been received from the G4 Construction website contact form. \n\n" . 
                         "--- Inquiry Details ---\n" .
                         "Name: " . $name . "\n" . 
                         "Email: " . $email . "\n" .
                         "-------------------------\n\n" .
                         "Message:\n" . $message;

        $mail->send();
        
        // SUCCESS: Redirect user to the contact page with a 'status=success' parameter
        header("Location: contact.html?status=success"); 
        exit();

    } catch (Exception $e) {
        // ERROR: Redirect user to the contact page with a 'status=error' parameter
        header("Location: contact.html?status=error"); 
        
        // Log the detailed error for debugging purposes (optional, but recommended)
        // error_log("PHPMailer Error: {$mail->ErrorInfo}");
        exit();
    }

} else {
    // If not sent via POST method (e.g., direct file access)
    http_response_code(405); // Method Not Allowed
    
    // ENGLISH RESPONSE
    echo "Direct access to this script is not allowed."; 
}
?>