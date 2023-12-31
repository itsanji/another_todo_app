import { useContext, useState } from "react";
import { GlobalContext } from "../../contexts/globalContext";
import { api } from "../../utils/constants";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { afterAuth, redirectOrigin } from "../../utils/afterAuth";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();

    const loginHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        globalContext.fetch
            .post(api().auth.login, {
                username,
                password
            })
            .then(({ data }) => {
                if (data.success) {
                    toast("logged in");
                    afterAuth(data, globalContext);
                    globalContext.updateAuthState(true);
                    redirectOrigin(navigate);
                } else {
                    if (data.success === false) {
                        toast.error(data.error);
                    }
                }
            })
            .catch((e: AxiosError) => {
                if (e.response) {
                    console.log(e.response.data);
                    toast.error("loggin failed. check credentials");
                }
            });
    };

    return (
        <>
            <h3 className="text-lg font-bold text-center mb-4">Login</h3>
            <form onSubmit={loginHandler} className="max-w-sm mx-auto p-4">
                <div className="mb-4">
                    <input
                        type="text"
                        value={username}
                        placeholder="email"
                        onChange={(e) => setUsername(e.currentTarget.value)}
                        className="input input-bordered input-primary w-full"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        value={password}
                        placeholder="password"
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        className="input input-bordered input-primary w-full"
                    />
                </div>
                <button type="submit" className="w-full btn btn-outline">
                    Submit
                </button>
            </form>
        </>
    );
};

export default Login;
