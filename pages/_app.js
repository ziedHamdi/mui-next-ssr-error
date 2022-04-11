import * as React from 'react';
import Head from 'next/head';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider} from '@emotion/react';
import theme from '../components/theme';
import createEmotionCache from '../src/createEmotionCache';
// import createEmotionCache from "../lib/createEmotionCache";
import {StyledEngineProvider} from '@mui/material/styles';
import {ApolloProvider} from "@apollo/client";
import {SessionProvider} from "next-auth/react"
import {appWithTranslation} from "next-i18next";
import {useApollo} from "../apollo/client";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
// import '../lib/overrides/react-image-gallery/image-gallery.css'
// import '../lib/overrides/global.css'
// import {initGA} from "../common/analytics";

//followed example: https://github.com/mui/material-ui/tree/master/examples/nextjs
function App(props) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
    const apolloClient = useApollo(pageProps)

    return (
        <CacheProvider value={emotionCache}>
            <StyledEngineProvider injectFirst>
                <ApolloProvider client={apolloClient}>
                    <SessionProvider session={pageProps.session}>
                        <Head>
                            <meta name="viewport" content="initial-scale=1, width=device-width"/>

                            <title>WeAlly</title>
                            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                            <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"/>
                            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
                            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
                            <link rel="manifest" href="/images/site.webmanifest"/>
                        </Head>

                        <ThemeProvider theme={theme}>
                            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                            <CssBaseline/>
                            <Component {...pageProps} />
                        </ThemeProvider>
                    </SessionProvider>
                </ApolloProvider>
            </StyledEngineProvider>
        </CacheProvider>
    );
}


export default appWithTranslation(App);
