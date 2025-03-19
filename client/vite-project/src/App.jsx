import { useState, useRef, useEffect } from "react";
import "./styles/App.css";
import AddCommentForm from "./components/AddCommentForm";
import CommentList from "./components/CommentList";
import Inscription from "./components/Inscription";
import Connexion from "./components/connexion";
import { initAuth, isAuthenticated, getCurrentUser } from './utils/auth';

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConnexion, setIsConnexion] = useState(false);
  const [isInscription, setIsInscription] = useState(false);
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

  useEffect(() => {
    initAuth();

    if (isAuthenticated()) {
      const user = getCurrentUser();
      console.log('User is already logged in:', user);
    }
  }, []);

  return (
    <div className="bg-vlgray min-h-screen">
      <Connexion setIsConnexion={setIsConnexion} setIsInscription={setIsInscription} />
      {isInscription && (
        <Inscription onUserAdded={handleUserAdded} setIsSubmitted={setIsSubmitted} />
      )}
      {isConnexion && (
        <div className="h-screen flex flex-col p-5">
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
  );
}
