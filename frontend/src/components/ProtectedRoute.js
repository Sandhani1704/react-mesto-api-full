import React from 'react';
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
    return (
        <Route>
            {
                // Если значение loggedIn — true, Route либо отрисует компонент, который передан HOC-компоненту как пропс,
                // включая переданные пропсы, либо вернёт компонент Redirect и переадресует пользователя на страницу авторизации. 
                () => props.loggedIn ? <Component {...props} /> : <Redirect to="./signin" />
            }
        </Route>
    )
};

export default ProtectedRoute;