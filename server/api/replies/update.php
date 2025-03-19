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
    
        try {
            $database = new Database();
            $db = $database->getConnection();
            $query = "UPDATE replies SET content = :content, created_at = :created_at, score = :score, user_id = :user_id, parent_comment_id = :parent_comment_id WHERE id = :id";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(':id', $data['id']);
            $stmt->bindParam(':content', $data['content']);
            $stmt->bindParam(':created_at', $data['created_at']);
            $stmt->bindParam(':score', $data['score']);
            $stmt->bindParam(':user_id', $data['user_id']);
            $stmt->bindParam(':parent_comment_id', $data['parent_comment_id']);
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Reply updated successfully',
                    'reply_id' => $data['id']
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update reply',
                    'error' => $stmt->errorInfo()
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
?>