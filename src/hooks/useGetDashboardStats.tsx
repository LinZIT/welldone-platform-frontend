import { useState, useContext, useEffect } from "react";
import { baseUrl } from "../common";
import { AuthContext } from "../context/auth";
import { DashboardStatsIT } from "../interfaces";

type DataCustomHook = {
    loading: boolean;
    thisMonth: DashboardStatsIT | null;
}
export const useGetDashboardStats: (department: string) => DataCustomHook = (department) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { authState } = useContext(AuthContext);
    const [thisMonth, setThisMonth] = useState<DashboardStatsIT | null>(null);
    const getStats = async () => {
        setLoading(true);
        const url = `${baseUrl}/stats/${department}/dashboard`;
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authState.token}`
            }
        }
        try {
            const response = await fetch(url, options);
            switch (response.status) {
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
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getStats();
    }, [])
    return { loading, thisMonth }
}