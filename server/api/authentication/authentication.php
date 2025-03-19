<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Cache-Control, Pragma"); 
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Initialize variables
$email = '';
$password = '';
$error = '';

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($_POST)) {
        if (isset($_POST['email']) && isset($_POST['password'])) {
            var_dump($_POST['email']);
            $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
            $password = $_POST['password'];
        }
    } else {
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
    }

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password required']);
        exit;
    }

    require_once('../../config/database.php');

    try {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $token = bin2hex(random_bytes(32));
            
            $stmt = $pdo->prepare('UPDATE users SET auth_token = ?, token_expiry = ? WHERE id = ?');
            $expiry = date('Y-m-d H:i:s', strtotime('+1 day'));
            $stmt->execute([$token, $expiry, $user['id']]);
            
            unset($user['password']);
            
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password'
            ]);
        }
    } catch (Exception $e) {
        error_log("Authentication error: " . $e->getMessage());
        
        echo json_encode([
            'success' => false,
            'message' => 'Server error'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>