import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const Auth = () => {
  const navigate = useNavigate();
  const { token } = useAppContext()

  useEffect(() => {

    navigate(token ? 'home' : 'login', { replace: true })
  }, [token]);

  return (
    <>
      <Outlet />
    </>
  )
}

export default Auth