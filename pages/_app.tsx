import React from 'react'
import App from 'next/app'
import Head from 'next/head';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import '../localization';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#189F5A'
        }
    }
});

export class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        
        return (
            <ThemeProvider theme={theme}>
                <Head>
                    <link rel="shortcut icon" href="/favicon.svg" />
                    <title>mintview</title>
                </Head>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        )
    }
}

export default MyApp;