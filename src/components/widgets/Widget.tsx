import { ReactNode, FC } from "react";

import { Paper, Box, Divider, Tooltip, IconButton, lighten, Typography } from "@mui/material";
import { green, red, amber, blue, grey } from "@mui/material/colors";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import RemoveRounded from "@mui/icons-material/RemoveRounded";

import { TypographyCustom } from "../custom";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as TooltipCharts, LineChart, Line, Legend } from "recharts";

import { TooltipProps } from 'recharts';
// for recharts v2.1 and above
import {
    ValueType,
    NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { Loading } from "../ui/content/Loading";

const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<ValueType, NameType>) => {
    if (active) {
        return (
            <Box sx={{ backdropFilter: 'blur(0.8px)', border: '1px solid black', borderRadius: 2, p: 2, background: (theme) => theme.palette.background.paper, filter: 'opacity(0.8)' }}>
                <TypographyCustom fontSize={12}>{`${payload?.[0].dataKey === 'thisMonth' ? 'Mes actual' : 'Mes pasado'} : ${payload?.[0].value}`}</TypographyCustom>
            </Box>
        );
    }

    return null;
};

interface PropsWidget {
    percentage: number;
    title: string;
    thisMonth: string;
    pastMonth: string;
    mode: number;
    icon: ReactNode;
    loading?: boolean;
}
export const Widget: FC<PropsWidget> = ({ percentage, title, thisMonth, pastMonth, mode, icon, loading = true }) => {
    const data = [{
        title,
        thisMonth,
        pastMonth
    },
        // {
        //     title,
        //     thisMonth,
        //     pastMonth
        // },
    ]
    return (
        <Paper elevation={0} sx={{ border: '1px solid rgba(150,150,150, 0.2)', p: 2, borderRadius: 5, }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1, flexFlow: 'row nowrap' }}>
                {icon}
                <TypographyCustom fontSize={12} fontmode={2}>{title}</TypographyCustom>
            </Box>
            <Divider sx={{ marginBottom: 3, marginTop: 2 }} />
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1,
                minHeight: 50
            }}>
                {loading
                    ? (<Loading />)
                    : (<>
                        <TypographyCustom fontWeight={'bold'} fontSize={32}>{thisMonth}</TypographyCustom>
                        <Tooltip title={`Mes pasado: ${pastMonth}`}>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size={'small'} sx={{ background: lighten(mode === 1 ? green[500] : mode === 2 ? red[500] : amber[500], 0.4), color: mode === 1 ? green[700] : mode === 2 ? red[700] : amber[700], width: 20, height: 20 }}>
                                    {mode && mode === 1
                                        ? (<ArrowUpwardRounded sx={{ width: 15 }} />)
                                        : mode === 2 ? (<ArrowDownwardRounded sx={{ width: 15 }} />)
                                            : (<RemoveRounded sx={{ width: 15 }} />)
                                    }
                                </IconButton>
                                <TypographyCustom variant='subtitle2' _color={mode === 1 ? 'success' : mode === 2 ? 'error' : 'warning'}>{percentage.toFixed(2)}%</TypographyCustom>
                            </Box>
                        </Tooltip>

                        {/* <ResponsiveContainer width="100%" aspect={2}>
                            <LineChart width={730} height={250} data={data}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}> */}
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
                        {/* <XAxis dataKey="title" /> */}
                        {/* <YAxis /> */}
                        {/* <Tooltip /> */}
                        {/* <Legend />
                                <TooltipCharts shared={false} content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="pastMonth" stroke={grey[500]} />
                                <Line type="monotone" dataKey="thisMonth" stroke={mode === 1 ? green[500] : mode === 2 ? red[500] : amber[500]} />
                            </LineChart> */}
                        {/* <LineChart data={data} width={100} height={100} margin={{ top: 2, bottom: 2, right: 2, left: 2 }}>
                                <XAxis dataKey="title" />
                                <YAxis />
                                <Line dataKey='pastMonth' label={{ fill: '#FFF', fontSize: 12 }} fill={grey[500]} />
                                <Line dataKey='thisMonth' label={{ fill: '#FFF', fontSize: 12 }} fill={mode === 1 ? green[500] : mode === 2 ? red[500] : amber[500]} />
                                <TooltipCharts shared={false} content={<CustomTooltip />} />
                            </LineChart> */}
                        {/* </ResponsiveContainer> */}

                        <ResponsiveContainer width="80%" aspect={2}>
                            <BarChart data={data} width={100} height={100} margin={{ top: 2, bottom: 2, right: 2, left: 2 }}>
                                {/* <XAxis dataKey="name" />
                                <YAxis />  */}
                                <Bar dataKey='pastMonth' label={{ fill: '#FFF', fontSize: 12 }} fill={grey[500]} />
                                <Bar dataKey='thisMonth' label={{ fill: '#FFF', fontSize: 12 }} fill={mode === 1 ? green[500] : mode === 2 ? red[500] : amber[500]} />
                                <TooltipCharts shared={false} content={<CustomTooltip />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </>)}
            </Box>
            <TypographyCustom variant="subtitle2" fontmode={2} fontSize={12} color="text.secondary">Comparado con el mes pasado</TypographyCustom>
        </Paper>
    )
}
