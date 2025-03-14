<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Cache-Control, Pragma"); 
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Debug log
error_log("Request received at " . date('Y-m-d H:i:s'));
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    error_log("Raw input: " . $json_data);
    
    $data = json_decode($json_data, true);
    error_log("Decoded data: " . print_r($data, true));
    
    // Check if we have the required data
    if (isset($data['username']) && isset($data['email']) && isset($data['password'])) {
        try {
            $database = new Database();
            $db = $database->getConnection();
            
            $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
            
            // Make image_png_url optional
            $image_png_url = isset($data['image_png_url']) ? $data['image_png_url'] : null;
            
            $query = "INSERT INTO users (username, email, password, status, image_png_url) 
                     VALUES (:username, :email, :password, 'active', :image_png_url)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':image_png_url', $image_png_url);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'User registered successfully',
                    'user_id' => $db->lastInsertId()
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to register user',
                    'error' => $stmt->errorInfo()
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
    } else {
        // Detailed error message showing which fields are missing
        $missing = [];
        if (!isset($data['username'])) $missing[] = 'username';
        if (!isset($data['email'])) $missing[] = 'email';
        if (!isset($data['password'])) $missing[] = 'password';
        
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: ' . implode(', ', $missing),
            'received_data' => $data
        ]);
    }
} else {
    // Not a POST request
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Expected POST, got ' . $_SERVER['REQUEST_METHOD']
    ]);
}
?>