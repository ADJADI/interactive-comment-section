import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  // En dev : proxy Vite vers localhost:4000. En prod : chemin relatif /graphql
  // derrière le reverse proxy nginx (voir nginx.conf), même domaine que le front.
  uri: import.meta.env.VITE_GRAPHQL_URI || "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
