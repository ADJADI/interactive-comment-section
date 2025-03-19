import { useState } from 'react'
import PropTypes from 'prop-types';
import { login } from "../utils/auth"
export default function Connexion({ setIsInscription, setIsConnexion, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await login(email, password);
            setIsConnexion(true);
            if (onLoginSuccess) {
                onLoginSuccess(user);
            }
        } catch (error) {
            setError(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-2">Déja un compte ?</h1>
            <p className="mb-4 text-gray-600">Connectez-vous pour accéder à votre compte</p>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    className="border p-2 rounded"
                // minLength="6"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-mblue text-white py-2 px-4 rounded hover:opacity-90 disabled:opacity-50"
                >
                    {isLoading ? 'Connexion...' : 'Connexion'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <button
                    className="underline hover:text-mblue"
                    onClick={() => setIsInscription(true)}
                >
                    Pas encore de compte
                </button>
            </div>
        </div>
    );
}

Connexion.propTypes = {
    setIsInscription: PropTypes.func.isRequired,
    setIsConnexion: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func
};
