import { TableBody, TableRow, TableCell, Dialog, AppBar, Box, darken, Divider, Grid, IconButton, Toolbar } from "@mui/material";
import { FC, useState } from "react";
import { IAdviser, IClaim } from "../../../interfaces";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { toast } from "react-toastify";
import { CloseRounded } from "@mui/icons-material";
import { ucwords } from "../../../lib/functions";
import { TypographyCustom } from "../../custom";
import { DescripcionDeVista } from "../../ui/content/DescripcionDeVista";
import { useUserStore } from "../../../store/user/UserStore";

interface ShortClaim extends IClaim {
    id: number;
}
interface Props {
    claim: ShortClaim;
}
export const ClaimTableCellDialog: FC<Props> = ({ claim: claimInfo }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [claim, setClaim] = useState<IClaim | null>(null)
    const getClaimData = async () => {
        const url = `/claim/${claimInfo.id}`;
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setClaim(data);
                break;
            case 400:
                toast.success('No se encontro resultado')
                break;
            default:
                toast.success('Ha ocurrido un error inesperado')
                break;
        }
    }

    const openDialog = () => {
        getClaimData();
        setOpen(true);
    }

    const closeDialog = () => {
        setOpen(false);
        setClaim(null);
    }
    return (<>
        <TableBody onClick={openDialog} sx={{
            cursor: 'pointer', '&:hover': {
                background: 'rgba(0,0,0,0.1)'
            }
        }}>
            <TableRow>
                <TableCell>{claimInfo.claim_date}</TableCell>
                <TableCell>{claimInfo.claim_number}</TableCell>
                <TableCell>{claimInfo.policy_number}</TableCell>
                <TableCell>{claimInfo.cause}</TableCell>
                <TableCell>{claimInfo.location_of_damage}</TableCell>
            </TableRow>
        </TableBody>
        <Dialog fullScreen open={open} onClose={closeDialog}>
            <AppBar sx={{ background: (theme) => theme.palette.mode === 'dark' ? '#101010' : darken(useUserStore.getState().user.color, 0.9) }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <TypographyCustom>Claim #{claimInfo.claim_number}</TypographyCustom>
                        <IconButton onClick={closeDialog} sx={{ color: 'white' }}>
                            <CloseRounded />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ width: '80%', marginInline: 'auto', marginBlock: 15 }}>
                <DescripcionDeVista title={"Informacion del claim"} description={"Consulta el claim, sus agentes e informacion mas detallada"} buttons={false} />
                <Grid container spacing={2} sx={{ margin: 'auto' }}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Fecha del Claim</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{claim?.claim_date}</TypographyCustom>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Numero de Claim</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{claim?.claim_number}</TypographyCustom>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Causa</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{claim?.cause}</TypographyCustom>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Ubicacion del daño</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{claim?.location_of_damage}</TypographyCustom>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Compañia Ajustadora</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{claim?.adjusting_company?.description}</TypographyCustom>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Compañia de Seguros</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{claim?.insurance_company?.description}</TypographyCustom>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Numero de poliza</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{claim?.policy_number}</TypographyCustom>
                        </Box>

                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Direccion</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{`${claim?.address}, ${claim?.city}, ${claim?.state}, ${claim?.zip_code}`}</TypographyCustom>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexFlow: 'column wrap' }}>
                            <TypographyCustom fontWeight="bold" color="text.secondary">Asesor(es)</TypographyCustom>
                            {claim?.advisers?.map((adviser: IAdviser, i: number) => (<TypographyCustom fontWeight={200} key={i}>{`${ucwords(adviser.names.toLocaleLowerCase())} ${ucwords(adviser.surnames.toLocaleLowerCase())}`}</TypographyCustom>))}
                            <Divider />
                            <TypographyCustom fontWeight="bold" color="text.secondary">Equipo</TypographyCustom>
                            <TypographyCustom fontWeight={200}>{`${claim?.team?.city?.description} - ${ucwords(claim?.team?.adviser.names.toLocaleLowerCase()!)} ${ucwords(claim?.team?.adviser?.surnames.toLocaleLowerCase()!)}`}</TypographyCustom>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    </>
    )
}