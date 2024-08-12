import react, { useState, useRef } from "react";
import "./styles/App.css";
import AddCommentForm from "./components/AddCommentForm";
import CommentList from "./components/CommentList";
import User from "./components/User";
import AddReply from "./components/AddReply";

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState(null);

  const handleUserAdded = (userData) => {
    setUser(userData);
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
              userId={user.id}
              username={user.username}
              imagePngUrl={user.imagePngUrl}
              imageWebUrl={user.imageWebUrl}
            />
          </div>
        )}
      </div>
    </>
  );
}
