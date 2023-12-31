import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/globalContext";
import { api, constants } from "../utils/constants";
import { afterAuth, redirectOrigin } from "../utils/afterAuth";
import NavBar from "./UI/NavBar";

const Layout: React.FC = () => {
    const globalContext = useContext(GlobalContext);
    const [checked, setChecked] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const currentURL = location.pathname + location.search;
        window.localStorage.setItem(constants.redirectOriginKey, currentURL);

        const verifing = async () => {
            // verifing token
            const accessToken = window.localStorage.getItem(constants.accessTokenKey);
            const refreshToken = window.localStorage.getItem(constants.refreshTokenKey);

            if (!accessToken || !refreshToken) {
                if (location.pathname === "/auth") {
                    navigate(currentURL);
                } else {
                    navigate("/auth?state=login");
                }
                return;
            }

            const { data } = await globalContext.fetch.get(api().auth.verify, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            // verify complete, check if redirect origin
            if (data.success) {
                afterAuth(data, globalContext);
                redirectOrigin(navigate);
                return;
            }

            // checking w refresh token
            const { data: checkRefresh } = await globalContext.fetch.get(api().auth.refresh, {
                headers: {
                    Authorization: "Bearer " + refreshToken
                }
            });

            if (checkRefresh.success) {
                afterAuth(checkRefresh, globalContext);
                redirectOrigin(navigate);
                return;
            }

            if (location.pathname === "/auth") {
                navigate(currentURL);
            } else {
                navigate("/auth?state=login");
            }
        };

        if (globalContext && !checked) {
            verifing();
            setChecked(true);
        }
    }, [globalContext]);
    return (
        <div
            data-theme={globalContext.theme}
            style={{
                minHeight: "100vh"
            }}
        >
            <NavBar />
            <div style={{ padding: "10px" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
