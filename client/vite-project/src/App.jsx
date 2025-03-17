import { useState, useRef, useEffect } from "react";
import "./styles/App.css";
import AddCommentForm from "./components/AddCommentForm";
import CommentList from "./components/CommentList";
import User from "./components/User";
import axios from "axios";

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";

  const handleUserAdded = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsSubmitted(true);
    }
  }, []);

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/read.php?id=${userId}`);
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('currentUser', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const topRef = useRef(null);
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="bg-vlgray min-h-full">
        {!isSubmitted ? (
          <User onUserAdded={handleUserAdded} setIsSubmitted={setIsSubmitted} />
        ) : (
          <div className="h-screen flex flex-col">
            <CommentList
              currentUser={user}
              topRef={topRef}
              scrollToTop={scrollToTop}
            />
            <AddCommentForm
              scrollToTop={scrollToTop}
              userId={user?.id}
              username={user?.username}
              imagePngUrl={user?.imagePngUrl}
              imageWebUrl={user?.imageWebUrl}
            />
          </div>
        )}
      </div>
    </>
  );
}
