export interface DashboardStatsIT {
    last_month: LastMonth;
    this_month: ThisMonth;
}
type LastMonth = {
    [key: string]: string;
};
type ThisMonth = {
    [key: string]: Info;
};

type Info = {
    value: string;
    percentage: number;
    mode: number;
}
