import { useState, useEffect } from "react";
import { IRole } from "../interfaces";
import { request } from "../common/request";
import { IResponse } from "../interfaces/response-type";

export const useGetRoles = () => {
    const [roles, setRoles] = useState<IRole[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const getRoles = async () => {
        setLoading(true)
        const { status, response, err }: IResponse = await request('/roles', 'GET');

        switch (status) {
            case 200:
                const { data } = await response.json();
                setRoles(data);
                break;
            default:
                setErrors(['Ocurrio un error inesperado al consultar los roles']);
                break;
        }
        setLoading(false);
    }
    useEffect(() => {
        getRoles();
    }, [])

    return { roles, setRoles, loading, errors }
}