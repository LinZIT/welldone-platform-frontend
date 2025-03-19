import { Box, Tab, Tabs, tabsClasses, useTheme } from "@mui/material";
import { Layout } from "../../../components/ui"
import { DescripcionDeVista } from "../../../components/ui/content"
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/auth";
import FacebookIcon from "../../../components/icons/FacebookIcon";
import BlogIcon from "../../../components/icons/BlogIcon";
import EnvelopeIcon from "../../../components/icons/EnvelopeIcon";
import InstagramIcon from "../../../components/icons/InstagramIcon";
import LinkedInIcon from "../../../components/icons/LinkedInIcon";
import GoogleMyBusinessIcon from "../../../components/icons/GoogleMyBusinessIcon";
import TikTokIcon from "../../../components/icons/TikTokIcon";
import CheckRounded from "@mui/icons-material/CheckRounded";
import DocumentScannerRounded from "@mui/icons-material/DocumentScannerRounded";
import PendingRounded from "@mui/icons-material/PendingRounded";
import WebRounded from "@mui/icons-material/WebRounded";
import { MarketingInstagramMain } from "../../../components/stats/marketing/instagram";
import { MarketingFacebookMain } from "../../../components/stats/marketing/facebook";
import { MarketingMain } from "../../../components/stats/marketing";
import { MarketingTikTokMain } from "../../../components/stats/marketing/tiktok";
import { MarketingLinkedInMain } from "../../../components/stats/marketing/linkedin";
import { MarketingGMBMain } from "../../../components/stats/marketing/gmb";
import { MarketingWebMain } from "../../../components/stats/marketing/web";
import { MarketingBlogMain } from "../../../components/stats/marketing/blog";
import { MarketingEmailMain } from "../../../components/stats/marketing/email";
import { MarketingInProgressActionsMain } from "../../../components/stats/marketing/in_progress_actions";
import { MarketingExecutedActionsMain } from "../../../components/stats/marketing/executed_actions";

export const Marketing = () => {
  const [tabSelected, setTabSelected] = useState<number>(0);
  const theme = useTheme();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabSelected(newValue);
  };
  const { authState } = useContext(AuthContext);

  return (
    <Layout noMargin>
      <DescripcionDeVista title={"Marketing"} description={"Elige uno de los sub-departamentos de Marketing..."} />
      <Box sx={{
        flexGrow: 1,
      }}>
        <Tabs
          value={tabSelected}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons={"auto"}
          allowScrollButtonsMobile
          sx={{
            '& .Mui-scroll': {
              backgroundColor: authState.color,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: authState.color,
            },
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >

          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="Reporte" icon={<DocumentScannerRounded sx={{ color: theme.palette.text.secondary }} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="Instagram" icon={<InstagramIcon fill={theme.palette.text.secondary} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="Facebook" icon={<FacebookIcon fill={theme.palette.text.secondary} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="TikTok" icon={<TikTokIcon fill={theme.palette.text.secondary} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="LinkedIn" icon={<LinkedInIcon fill={theme.palette.text.secondary} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="GMB" icon={<GoogleMyBusinessIcon fill={theme.palette.text.secondary} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="Web" icon={<WebRounded sx={{ color: theme.palette.text.secondary }} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="Blog" icon={<BlogIcon fill={theme.palette.text.secondary} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="Email" icon={<EnvelopeIcon fill={theme.palette.text.secondary} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="Acciones Ejecutadas" icon={<CheckRounded sx={{ color: theme.palette.text.secondary }} width={20} height={20} />} />
          <Tab sx={{ textTransform: 'none', '&.Mui-selected': { color: authState.color } }} label="Acciones en proceso" icon={<PendingRounded sx={{ color: theme.palette.text.secondary }} width={20} height={20} />} />
        </Tabs>
      </Box>

      {/**
       * ■-----------------------------------------------■
       * | Tabs de las redes sociales y reporte general  |
       * ·----·------------------------------------------·
       * | 0  | Reporte general                          |
       * ·----·------------------------------------------·
       * | 1  | Instagram                                |
       * ·----·------------------------------------------·
       * | 2  | Facebook                                 |
       * ·----·------------------------------------------·
       * | 3  | TikTok                                   |
       * ·----·------------------------------------------·
       * | 4  | LinkedIn                                 |
       * ·----·------------------------------------------·
       * | 5  | GoogleMyBusiness                         |
       * ·----·------------------------------------------·
       * | 6  | Web                                      |
       * ·----·------------------------------------------·
       * | 7  | Blog                                     |
       * ·----·------------------------------------------·
       * | 8  | Email                                    |
       * ·----·------------------------------------------·
       * | 9  | Acciones Ejecutadas                      |
       * ·----·------------------------------------------·
       * | 10 | Acciones en proceso                      |
       * ■----·------------------------------------------■
       */}
      {tabSelected === 0 && (
        <MarketingMain />
      )}
      {tabSelected === 1 && (
        <MarketingInstagramMain />
      )}
      {tabSelected === 2 && (
        <MarketingFacebookMain />
      )}
      {tabSelected === 3 && (
        <MarketingTikTokMain />
      )}
      {tabSelected === 4 && (
        <MarketingLinkedInMain />
      )}
      {tabSelected === 5 && (
        <MarketingGMBMain />
      )}
      {tabSelected === 6 && (
        <MarketingWebMain />
      )}
      {tabSelected === 7 && (
        <MarketingBlogMain />
      )}
      {tabSelected === 8 && (
        <MarketingEmailMain />
      )}
      {tabSelected === 9 && (
        <MarketingExecutedActionsMain />
      )}
      {tabSelected === 10 && (
        <MarketingInProgressActionsMain />
      )}
    </Layout >
  )
}