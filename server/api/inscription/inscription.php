<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Cache-Control, Pragma"); 
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    if (isset($data['username']) && isset($data['email']) && isset($data['password']) && isset($data['image_png_url'])) {
        try {
            $database = new Database();
            $db = $database->getConnection();
            
            $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
            
            $query = "INSERT INTO users (username, email, password, status, image_png_url) 
                     VALUES (:username, :email, :password, 'active', :image_png_url)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':image_png_url', $data['image_png_url']);
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
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields',
            'received_data' => $data
        ]);
    }

?>