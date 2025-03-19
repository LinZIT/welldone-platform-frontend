import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { TypographyCustom } from '../../custom';

interface Props {
    title: string;
    text: string;
    children?: ReactNode;
}
export const NoContentFound: FC<Props> = ({ title, text, children }) => {
    return (
        <Box sx={styles.main}>
            <img src='/no-content.svg' width={300} height={300} />
            <TypographyCustom variant='h5' color='text.primary' fontWeight={'bold'}>{title}</TypographyCustom>
            <TypographyCustom variant='subtitle1' color='text.disabled' fontmode={2}>{text}</TypographyCustom>
            <Box sx={{ mt: 4 }}>
                {children}
            </Box>
        </Box>
    )
}
const styles = {
    main: {
        mt: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexFlow: 'column wrap',
        width: '100%'
    }
}