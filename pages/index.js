import Head from 'next/head'
import MainLayout from '../components/MainLayout'
import {gql, useQuery} from '@apollo/client'
import {Grid} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import DisplayState, {DEFAULT_STATES} from "../components/common/DisplayState";

import {addApolloState, initializeApollo} from '../apollo/client'
import {getDataFromTree} from "@apollo/client/react/ssr";
import {getFullUrl} from "../constants/util";
import {getSession} from "next-auth/react";
import {prepareContext} from "../api/graphql";
import useMediaQuery from '@mui/material/useMediaQuery';
import {NOT_MOBILE_SCREEN_SIZE} from "../constants/screenSizes";


//more about ssr https://www.apollographql.com/docs/react/v2/performance/server-side-rendering/

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const client = initializeApollo({})
  // const content = await getDataFromTree(Index)

  //this is needed in order to make useSession return the user immediately: https://next-auth.js.org/tutorials/securing-pages-and-api-routes

  const {locale} = context
  const documentProps = addApolloState(client, {
    props: {...(await serverSideTranslations(locale, ['header', 'complaintList', 'footer']))},
    revalidate: 1,
  })
  const fullUrl = getFullUrl(context.req)

  // Will be passed to the page component as props
  // return {props: documentProps.props}
  return {props: {session, ...(documentProps.props), fullUrl}}
}

const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  complaintList: {
    [theme.breakpoints.down('sm')]: {
      padding: '0 !important'
    }
  }
}));



export default function Index(props) {
  const classes = useStyles();
  const {t} = useTranslation('common');
  //extract a component with this logic then apply https://www.apollographql.com/docs/react/performance/server-side-rendering/#executing-queries-with-getdatafromtree on index
  //extract a component with this logic
  const mdScreenSize = useMediaQuery(NOT_MOBILE_SCREEN_SIZE)

  //FIXME move this to MainLayout along with the gql query
  return (
      <MainLayout>
        <Head>
          <title>WeAlly</title>
          <meta name="description"
                content="Requests and complaints by customer groups with real time statistics. Leverage the collective intelligence."/>
          <meta property="og:title" content="WeAlly: Business reviews through collective intelligence"/>
          <meta property="og:description"
                content="Requests and complaints by customer groups with real time statistics. Leverage the collective intelligence."/>
          <meta property="og:image" content="https://weally.org/capture.jpg"/>
          <meta property="og:type" content="website"/>
          <meta property="og:url" content={props.fullUrl}/>
          <meta property="og:locale" content="en_US"/>
        </Head>

        <Grid container spacing={2}>
          <Grid item md={9} sm={12} className={classes.complaintList}>
            content
          </Grid>
          {mdScreenSize && <Grid item md={3}>
            large screen content
          </Grid>
          }
        </Grid>
      </MainLayout>
  )
  return "unhandled"
}