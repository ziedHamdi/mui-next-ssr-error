import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider} from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import {ApolloProvider} from "@apollo/client";

import {SessionProvider} from "next-auth/react"
import {appWithTranslation} from "next-i18next";
import {useApollo} from "../apollo/client";


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
    const apolloClient = useApollo(pageProps)
    return (
        <CacheProvider value={emotionCache}>
            <ApolloProvider client={apolloClient}>
                <SessionProvider session={pageProps.session}>

                    <Head>
                        <meta name="viewport" content="initial-scale=1, width=device-width"/>
                    </Head>
                    <ThemeProvider theme={theme}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline/>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </SessionProvider>
            </ApolloProvider>
        </CacheProvider>
    );
}

export default appWithTranslation(MyApp)

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};
