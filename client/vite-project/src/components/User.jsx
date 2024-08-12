import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import avatar1 from "../assets/images/avatars/image-amyrobson.png";
import avatar1webp from "../assets/images/avatars/image-amyrobson.webp";
import avatar2 from "../assets/images/avatars/image-juliusomo.png";
import avatar2webp from "../assets/images/avatars/image-juliusomo.webp";
import avatar3 from "../assets/images/avatars/image-maxblagun.png";
import avatar3webp from "../assets/images/avatars/image-maxblagun.webp";
import avatar4 from "../assets/images/avatars/image-ramsesmiron.png";
import avatar4webp from "../assets/images/avatars/image-ramsesmiron.webp";

const ADD_USER = gql`
  mutation AddUser(
    $username: String!
    $imagePngUrl: String!
    $imageWebUrl: String!
  ) {
    addUser(
      username: $username
      imagePngUrl: $imagePngUrl
      imageWebUrl: $imageWebUrl
    ) {
      id
      username
      imagePngUrl
      imageWebUrl
    }
  }
`;

export default function User({ setIsSubmitted, onUserAdded }) {
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [addUser] = useMutation(ADD_USER);

  const images = [
    {
      key: "avatar1",
      pngUrl: avatar1,
      webpUrl: avatar1webp,
    },
    {
      key: "avatar2",
      pngUrl: avatar2,
      webpUrl: avatar2webp,
    },
    {
      key: "avatar3",
      pngUrl: avatar3,
      webpUrl: avatar3webp,
    },
    {
      key: "avatar4",
      pngUrl: avatar4,
      webpUrl: avatar4webp,
    },
  ];

  const handleImageChange = (key) => {
    setSelectedAvatar(key);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedAvatar) {
      const selected = images.find((image) => image.key === selectedAvatar);
      const { data } = await addUser({
        variables: {
          username,
          imagePngUrl: selected.pngUrl,
          imageWebUrl: selected.webpUrl,
        },
      });
      setIsSubmitted(true);
      setUsername("");
      setSelectedAvatar("");
      onUserAdded(data.addUser);
    } else {
      alert("Please select an image.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen">
      <div className="flex flex-col gap-5 px-10 py-32 rounded-md shadow-2xl relative">
        <h1 className="text-xl font-semibold">Comment Section</h1>
        <input
          className="h-10 rounded-md border-blue-400 border-2 focus:outline-none"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <div className="flex">
          {images.map((image) => (
            <button
              key={image.key}
              type="button"
              onClick={() => handleImageChange(image.key)}
              className={
                selectedAvatar === image.key
                  ? "border-2 border-blue-500 rounded-full"
                  : ""
              }
            >
              <picture className="relative">
                <source srcSet={image.webpUrl} type="image/webp" />
                <img src={image.pngUrl} alt={`Avatar ${image.key}`} />
              </picture>
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="absolute bottom-5 right-5 rounded-xl px-8 py-2 shadow-md bg-blue-400 text-white font-semibold"
        >
          Add User
        </button>
      </div>
    </form>
  );
}
