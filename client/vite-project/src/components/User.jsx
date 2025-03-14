import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

export default function User({ setIsSubmitted, onUserAdded }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    image_png_url: ''
  });
  const [error, setError] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";

  useEffect(() => {
    if (formData.password === confirmPassword) {
      setIsPasswordMatch(true);
      setError('');
    } else {
      setIsPasswordMatch(false);
      if (confirmPassword) {
        setError('Passwords do not match');
      }
    }
  }, [formData.password, confirmPassword]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image_png_url: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordMatch) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    const requestData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      image_png_url: formData.image_png_url
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/inscription/inscription.php`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );


      const data = response.data;

      if (data.success) {
        alert('Registration successful');
        if (onUserAdded) {
          setIsSubmitted(true);
          onUserAdded(data.user_id);
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const input = (type, placeholder, value, onChange, required = true) => {
    return (
      <input
        className="h-10 rounded-md border-blue-400 border-2 focus:outline-none"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen">
      <div className="flex flex-col gap-5 px-10 py-32 rounded-md shadow-2xl relative">
        <h1 className="text-xl font-semibold">Comment Section</h1>
        {input('text', 'Username', formData.username, (e) => setFormData({ ...formData, username: e.target.value }))}
        {input('file', 'Image', '', handleImageChange, false)}
        {input('password', 'Password', formData.password, (e) => setFormData({ ...formData, password: e.target.value }))}
        {input('password', 'Confirm Password', confirmPassword, (e) => setConfirmPassword(e.target.value))}
        {input('email', 'Email', formData.email, (e) => setFormData({ ...formData, email: e.target.value }))}
        {formData.image_png_url && <img src={formData.image_png_url} alt="" className="rounded-full" />}
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="absolute bottom-5 right-5 rounded-xl px-8 py-2 shadow-md bg-blue-400 text-white font-semibold"
          disabled={!isPasswordMatch}
        >
          Add User
        </button>
      </div>
    </form>
  );
}

User.propTypes = {
  setIsSubmitted: PropTypes.func.isRequired,
  onUserAdded: PropTypes.func.isRequired
};
