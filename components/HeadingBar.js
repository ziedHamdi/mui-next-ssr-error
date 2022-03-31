import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NPage from "next/link";
import Link from "@mui/material/Link";
import React, {useEffect, useState} from "react";
import * as PropTypes from "prop-types";
// import makeStyles from '@mui/styles/makeStyles';
import {makeStyles} from 'tss-react/mui';
import {
    useSession, signIn, signOut
} from 'next-auth/react'
import {Box, Icon} from "@mui/material";
import Nlink from "next/link";
import {useApolloClient} from "@apollo/client";
import {useRouter} from 'next/router'

import {Menu, MenuItem, Divider} from '@mui/material';
import {ExpandMore} from '@mui/icons-material';
import ReactGA from "react-ga";

// can override sign in error messages : https://simplernerd.com/next-auth-custom-error-page/

const useStyles = makeStyles()((theme) => {
    return {
        appBar: {
            // borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'white',
            padding: '0 2%',
            [theme.breakpoints.up('lg')]: {
                padding: '0 12%',
            },
        },
        toolbar: {
            flexWrap: 'wrap',
            padding: 0,
            display: 'flex',
            alignContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(0.5)
        },
        close: {
            color: theme.palette.text.secondary
        },
        logoA: {
            width: 'auto',
            paddingTop: theme.spacing(1)
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
            gap: theme.spacing(1)
        },
        link: {
            margin: theme.spacing(1, 1.5),
            cursor: 'pointer'
        },
        user: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing(1, 1, 1, 2),
            '& img': {
                borderRadius: '50%',
                marginRight: theme.spacing(0.5),
                height: theme.spacing(4.5),
                width: theme.spacing(4.5)
            },
            cursor: 'pointer'
        },
        logout: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
        }
    }
})

export default function HeadingBar(props) {
    const {classes} = useStyles();
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
        <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
            <Toolbar sx={{
                flexWrap: 'wrap',
                padding: 0,
                display: 'flex',
                alignContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.5
            }}>
                {notHomePage && <Icon onClick={() => router.push("/")} className={classes.close}>
                    close
                </Icon>}
                <Nlink href="/">
                    <a className={classes.logoA}><img className={classes.logo} src="/images/logo_h40px.svg"
                                                      alt="WeAlly logo"/></a>
                </Nlink>
                <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                    {/*<Typography variant="body1" color="secondary"> > McDonald's x</Typography>*/}
                </Typography>

                {session &&
                (<Box onClick={handleMenuOpen} className={classes.user}>
                    <img src={session.user.image}></img>
                    <ExpandMore/>
                </Box>)
                }

                {!session &&
                <nav>
                    <Link
                        variant="button"
                        color="primary"
                        className={classes.link}
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
                        <div className={classes.logout}>
                            <Box className={classes.user}>
                                <img src={session.user.image}></img>
                                <Typography variant="h6">{session.user.name}</Typography>
                            </Box>
                        </div>
                    </MenuItem>
                    <MenuItem onClick={doSignOut}>
                        <Typography variant="button" className={classes.link}>Sign out</Typography>
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
