import dynamic from "next/dynamic";
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Box} from "@mui/material";

// const HeadingBar = dynamic(() => import( "./HeadingBar" ))
// const Footer = dynamic(() => import( "./HeadingBar" ))
import HeadingBar from "./HeadingBar"
import Footer from  "./Footer"

const sx = {
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    link: {
        mx: 1.5,
        my: 1
    },
    mainLayout: {
        minWidth: '320px',
        p: {
            xs: 0
        },
        display: 'flex',
        flexDirection: 'column'
    },
    body: {
        backgroundColor: 'background.default',
        px: {
            xs: 0,
            lg: '12%'
        },
        py: 3,
    },
    trending: {
        minHeight: '5em'
    },
    content: {
        mt: {
            xs: 0,
            md: 0
        },
        display: 'flex',
        flexFlow: 'column',
        maxWidth: '100% !important',
    },
    footer: {
        pt: {
            xs: 0.5,
            md: 1.5
        },
        pb: {
            xs: 0.5,
            md: 3
        },
    },
}

export default function MainLayout({children, showTrending}) {
    return (
        <React.Fragment>
            <CssBaseline/>
            {/* Header */}
            <Container maxWidth="xl" sx={sx.mainLayout} id="MainLayout">
                <HeadingBar/>
                {/* End Header */}
                <Grid container direction="column" sx={sx.body} id="MainLayoutBody">
                    {showTrending && (<Grid item sx={sx.trending} id="MainLayoutTrending">
                        <Typography component="h1" variant="h5" align="left" color="textPrimary" gutterBottom>
                            Trending
                        </Typography>
                        <Grid container spacing={4} justifyContent="space-evenly">
                        </Grid>

                    </Grid>)}

                    <Grid item sx={sx.content} id="MainLayoutContent">
                        {children}
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box component="footer" sx={sx.footer} id='footer'>
                    <Footer/>
                </Box>
            </Container>
            {/* End footer */}
        </React.Fragment>
    );
}