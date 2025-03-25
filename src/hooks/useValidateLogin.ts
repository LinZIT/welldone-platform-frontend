import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/auth";

export const useValidateLogin = () => {
    /**
     * Estado del loader
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Funcion del contexto para validar token
     */
    const { validateToken } = useContext(AuthContext)

    /**
     * Hook de react router para redireccionar
     */
    const navigate = useNavigate();

    /**
     * Funcion para evaluar el resultado del validateToken
     */
    const validateSession = async () => {
        setLoading(true);
        const validation = await validateToken();
        if (validation.status) {
            setLoading(false);
            navigate(validation.path ? validation.path : '/');
        } else {
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        }
    }
    useEffect(() => {
        validateSession();
    }, [])

    return { loading, setLoading }
}