import { useState, useEffect } from "react";
import { DashboardStatsIT } from "../interfaces";
import { request } from "../common/request";
import { IResponse } from "../interfaces/response-type";

type DataCustomHook = {
    loading: boolean;
    thisMonth: DashboardStatsIT | null;
}
export const useGetDashboardStats: (department: string) => DataCustomHook = (department) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [thisMonth, setThisMonth] = useState<DashboardStatsIT | null>(null);
    const getStats = async () => {
        setLoading(true);
        const url = `/stats/${department}/dashboard`;
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                console.log({ data })
                setThisMonth(data);
                break;
            case 400:
                const { errors } = await response.json()
                console.log({ errors })
                break;
            default:

                break;
        }
        setLoading(false);
    }
    useEffect(() => {
        getStats();
    }, [])
    return { loading, thisMonth }
}