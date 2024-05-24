import styled from '@emotion/styled';
import { Avatar, Badge, useTheme } from '@mui/material';

const ProfilePic = ({ onClick, isActive, sx, src, alt="Loading" }) => {

    const theme = useTheme();


    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                //animation: 'ripple 1.2s infinite ease-in-out',
                //border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    return (<>
        {
            isActive ?
                (<StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }
                    }
                    variant="dot"
                    theme={theme}
                >
                    <Avatar onClick={onClick} sx={sx} alt={alt} src={src} />
                </StyledBadge >) :
                (<Avatar onClick={onClick} sx={sx} alt={alt} src={src} />)
        }

    </>)
}

export default ProfilePic