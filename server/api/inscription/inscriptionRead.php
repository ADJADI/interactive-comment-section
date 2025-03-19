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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if (isset($_POST['email']) && isset($_POST['password'])) {
            $email = $_POST['email'];
            $password = $_POST['password'];
            $query = "SELECT id, username, image_png_url, image_web_url FROM users WHERE email = :email AND password = :password";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode([
                    'success' => true,
                    'data' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'imagePngUrl' => $user['image_png_url'],
                        'imageWebUrl' => $user['image_web_url']
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]);
            }
        } else {
            $query = "SELECT id, username, image_png_url, image_web_url FROM users";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'success' => true,
                'data' => $users
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
        'message' => 'Invalid request method'
    ]);
}
?>
