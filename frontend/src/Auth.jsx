import { loginWithTwitter } from "./api";

export function loginWithFacebook() {
    window.location.href = "https://your-backend-url.onrender.com/auth/facebook";
}

function Auth() {
    return (
        <div>
            <h2>Sign in to Write Journals</h2>
            <button onClick={loginWithTwitter}>Login with Twitter</button>
            <button onClick={loginWithFacebook}>Login with Facebook</button>
        </div>
    );
}

export default Auth;
