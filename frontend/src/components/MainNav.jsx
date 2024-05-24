import styles from './styles/MainNav.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, InputBase, List, ListItem, ListItemIcon, ListItemText, alpha, styled, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GrapseeImage from '../assets/grapsee.png';
import { PostAddOutlined } from '@mui/icons-material';

const MainNav = ({ items }) => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

    return (
        <div className={styles.container} style={{ borderRight: '0.1px solid #CCCCCC' }}>

            <img src={GrapseeImage} className={styles.grapseeImage} alt='Grapsee' />
            <Search style={{ background: '#EEEEEE' }} theme={theme}>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search>
            <List className={styles.list}>
                {items.map((item, index) => (
                    <ListItem button key={index} component={Link} to={item.route} activeclassname={styles.active}>
                        {item.icon && (
                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                {item.icon}
                            </ListItemIcon>
                        )}
                        {item.image && (
                            <ListItemIcon>
                                {item.image}
                            </ListItemIcon>
                        )}
                        <ListItemText primary={item.text} style={{ color: location.pathname === item.route ? theme.palette.primary.main : item.image ? 'gold' : '' }} />
                    </ListItem>
                ))}
            </List>

            <Button onClick={() => navigate('/new_post')} style={{ marginTop: '8px', marginBottom: '24px' }} startIcon={<PostAddOutlined />} variant="contained"><span style={{ textTransform: 'capitalize' }}>New Post</span></Button>

        </div>
    );
};

export default MainNav;
