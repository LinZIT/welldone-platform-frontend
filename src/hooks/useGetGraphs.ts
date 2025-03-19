import { useEffect, useState } from "react";
import { IResponse } from "../interfaces/response-type";
import { request } from "../common/request";

interface Props {
    url: string;
    limit?: number;
}
export const useGetGraphs = ({ url, limit = 20 }: Props) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [errors, setErrors] = useState<any>(null);

    const getData = async () => {
        setLoading(true)
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data: apiData } = await response.json()
                setData(apiData);
                setLoading(false);
                break;
            case 400:
                const { errors } = await response.json();
                setErrors(errors);
                setLoading(false);
                break;
            default:
                setErrors(['Ocurrio un error inesperado']);
                setLoading(false);
                break;
        }
    }
    useEffect(() => {
        getData();
    }, []);

    return { data, setData, loading, errors, getData }
}
