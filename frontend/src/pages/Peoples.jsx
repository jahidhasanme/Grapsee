import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { IconButton, List, ListItem } from "@mui/material";
import ProfilePic from "../components/ProfilePic";
import { useEffect } from "react";
import { Message } from "@mui/icons-material";


const Peoples = () => {

    const navigate = useNavigate();

    const { users, user } = useAppContext();

    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            overflowY: "scroll",
        }}>
            <List>
                {
                    users.map((u) =>
                        u._id != user._id && <ListItem onClick={() => navigate('../profile', { replace: true, state: { user: u } })} key={u._id} button>
                            <ProfilePic isActive={u.isActive} src={u.profile} />
                            <div style={{ flex: 'auto' }}>
                                <span style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '10px' }}>{u.name}</span>
                            </div>
                            <IconButton color="primary" onClick={(event) => {
                                event.stopPropagation();
                                navigate('../chating', { replace: true, state: { reciver: u } })
                            }}>
                                <Message />
                            </IconButton>
                        </ListItem>
                    )
                }
            </List>
        </div>
    )
}

export default Peoples