import { Fragment, FC } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { IconButton, darken } from '@mui/material';
import LinkRounded from '@mui/icons-material/LinkRounded';
import { useNavigate } from 'react-router';
import { getRandomColorPastel } from '../../../lib/functions';

type ListItem = {
    avatar: string;
    SVG?: boolean;
    title: string;
    text: string;
    path: string;
    color?: string;
}
interface Props {
    items: ListItem[];
}
export const AlignItemsList: FC<Props> = ({ items }) => {
    const router = useNavigate();
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 5, border: '1px solid rgba(150,150,150,0.5)' }}>
            {items && items.map((item, i) => (
                <Fragment key={i}>
                    <ListItem onClick={() => {
                        router(item.path)
                    }}
                        sx={{ cursor: 'pointer' }}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => router(item.path)}>
                                <LinkRounded />
                            </IconButton>
                        }>
                        <ListItemAvatar>
                            <Avatar sx={{ background: item.color ? item.color : darken(getRandomColorPastel(), 0.3), p: 1 }}>
                                {item.avatar}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.title} secondary={item.text} />
                    </ListItem>
                    {items.length > (i + 1) && (<Divider variant="inset" component="li" />)}
                </Fragment>
            ))}
        </List>
    );
}