import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import React, {useState} from "react";
import {
    useSession, signIn, signOut
} from 'next-auth/react'
import {Box, Icon} from "@mui/material";
import AddComplaint from "./complaint/AddComplaint";
import Nlink from "next/link";
import {useApolloClient} from "@apollo/client";
import {useRouter} from 'next/router'
import {Menu, MenuItem} from '@mui/material';
import {ExpandMore} from '@mui/icons-material';
import ReactGA from "react-ga";

// can override sign in error messages : https://simplernerd.com/next-auth-custom-error-page/

const sx = {
    appBar: {
        backgroundColor: 'white',
        p: 0,
        px: {
            sm: '2%',
            lg: '12%'
        }
    },
    toolbar: {
        flexWrap: 'wrap',
        padding: 0,
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.5,

    },
    close: {
        cursor: 'pointer',
        color: 'text.secondary'
    },
    logoA: {
        width: 'auto',
        paddingTop: 1
    },
    logo: {
        height: '28px',
        width: '70px',
    },

    toolbarTitle: {
        display: 'flex',
        flexFlow: 'row nowrap',
        flexGrow: 1,
        alignItems: 'center',
        gap: 1
    },
    link: {
        marginTop: 1,
        marginBottom: 1,
        marginRight: 1.5,
        marginLeft: 1.5,
        cursor: 'pointer'
    },
    user: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 1,
        paddingLeft:2,
        '& img': (theme)=>({
            borderRadius: '50%',
            marginRight: 0.5,
            height: theme.spacing(4.5),
            width: theme.spacing(4.5)
        }),
        cursor: 'pointer'
    },
    logout: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    }
}

export default function HeadingBar(props) {
    const client = useApolloClient()
    const {data: session, status} = useSession()

    //----------- menu ------------
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    //----------- menu end --------

    const router = useRouter()
    const pathname = router.pathname
    console.log('pathname: ', pathname, " root: ", pathname === "/")
    const notHomePage = pathname !== "/"

    return (
        <AppBar position="static" color="default" elevation={0} sx={sx.appBar} id="HeadingBar">
            <Toolbar sx={{
                flexWrap: 'wrap',
                pl: {
                    xs: 1,
                },
                pr: {
                    xs: 0,
                },
                display: 'flex',
                alignContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.5,
            }}>
                {notHomePage && <Icon onClick={() => router.push("/")} sx={sx.close}>
                    close
                </Icon>}
                <Nlink href="/">
                    <a sx={sx.logoA}><img sx={sx.logo} src="/images/logo_h40px.svg"
                                               alt="WeAlly logo"/></a>
                </Nlink>
                <Typography variant="h6" color="inherit" noWrap sx={sx.toolbarTitle}>
                    {/*<Typography variant="body1" color="secondary"> > McDonald's x</Typography>*/}
                </Typography>
                <AddComplaint category={null}/>

                {session &&
                (<Box onClick={handleMenuOpen} sx={sx.user}>
                    <img src={session.user.image}></img>
                    <ExpandMore/>
                </Box>)
                }

                {!session &&
                <nav>
                    <Link
                        variant="button"
                        color="primary"
                        sx={sx.link}
                        onClick={doSignIn}
                        underline="hover">
                        {"Sign in"}
                    </Link>
                </nav>
                }

                {session &&
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}

                    transformOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <MenuItem>
                        <div sx={sx.logout}>
                            <Box sx={sx.user}>
                                <img src={session.user.image}></img>
                                <Typography variant="h6">{session.user.name}</Typography>
                            </Box>
                        </div>
                    </MenuItem>
                    <MenuItem onClick={doSignOut}>
                        <Typography variant="button" sx={sx.link}>Sign out</Typography>
                    </MenuItem>
                </Menu>
                }

            </Toolbar>
        </AppBar>
    );

    async function doSignIn() {
        ReactGA.modalview('/user/signIn');
        await client.cache.reset()
        await client.cache.gc()
        await signIn()
    }

    async function doSignOut() {
        ReactGA.event({
            category: 'User',
            action: 'SignOut'
        });
        await client.cache.gc()
        await signOut()
    }

}
