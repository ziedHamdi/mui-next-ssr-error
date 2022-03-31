import dynamic from "next/dynamic";
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { makeStyles } from 'tss-react/mui';

const HeadingBar = dynamic(()=> import( "./HeadingBar" ))
const Footer =  dynamic(()=> import( "./Footer"))

const useStyles = makeStyles()((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    body: {
        backgroundColor: theme.palette.background.default,
        padding: '0 2%',
        paddingBottom: theme.spacing(4),
        [theme.breakpoints.up('lg')]: {
            padding: '0 12%',
        },
        [theme.breakpoints.down('md')]: {
            padding: 0
        }
    },
    container: {
        minWidth: '320px',
        [theme.breakpoints.down('sm')]: {
            padding: 0
        }
    },
    trending: {
        minHeight: '5em'
    },
    content: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexFlow: 'column',
        maxWidth: '100% !important',
        [theme.breakpoints.down('md')]: {
            margin: 0
        }
    },
    footer: {
        // borderTop: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.down('md')]: {
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
        },
    },
}));

export default function MainLayout({children, showTrending}) {
    const {classes} = useStyles();

    return (
        <React.Fragment>
            <CssBaseline/>
            {/* Header */}
            <Container maxWidth="xl" className={classes.container}>
                <HeadingBar/>
                {/* End Header */}
                <div className={classes.body}>
                    <Grid container direction="column">
                        {showTrending && (<Grid item className={classes.trending}>
                            <Typography component="h1" variant="h5" align="left" color="textPrimary" gutterBottom>
                                Trending
                            </Typography>
                            <Grid container spacing={4} justifyContent="space-evenly">

                            </Grid>

                        </Grid>)}

                        <Grid item className={classes.content}>
                            {children}
                        </Grid>
                    </Grid>
                </div>

                {/* Footer */}
                <div component="footer" className={classes.footer}>
                    <Footer/>
                </div>
            </Container>
            {/* End footer */}
        </React.Fragment>
    );
}