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
            $query = "DELETE FROM replies WHERE id = :id";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(':id', $data['id']);
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Reply deleted successfully',
                    'reply_id' => $data['id']
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete reply',
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