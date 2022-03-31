import {useMemo} from 'react'
import {ApolloClient, gql} from '@apollo/client'
import {HttpLink} from '@apollo/client/link/http'
import merge from 'deepmerge'
import {cache} from './cache'
import {isSSR} from "../constants/util";
import isEqual from 'lodash/isEqual'
import logger from "../lib/logger";

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

const typeDefs = gql`
  extend type Query {
    draftComplaints: [Complaint]
  }
`;

let apolloClient

function createIsomorphLink() {
    if (typeof window === 'undefined') {
        const frontEndGraphQLUrl = process.env.NEXT_PUBLIC_FRONT_END_SSR_URL + '/api/graphql'
        logger.debug("server side next links are pointing to ", frontEndGraphQLUrl)
        return new HttpLink({
            uri: frontEndGraphQLUrl,
            headers: {ssr: true},
            credentials: 'same-origin',
        })
    } else {
        return new HttpLink({
            uri: '/api/graphql',
            headers: {ssr: false},
            credentials: 'same-origin',
        })
    }
}

function createApolloClient() {
    let defaultOptions = {}
    if (typeof window === 'undefined') {
      defaultOptions = {
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        }
      }
    } else {
        defaultOptions = {
            query: {
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'all',
            }
        }
    }
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: createIsomorphLink(),
        cache,
        typeDefs,
        defaultOptions
    })
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient()

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) =>
                    sourceArray.every((s) => !isEqual(d, s))
                ),
            ],
        })

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }
    // For SSG and SSR always create a new Apollo Client
    if (isSSR()) return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export function useApollo(pageProps) {
    const state = pageProps[APOLLO_STATE_PROP_NAME]
    const store = useMemo(() => initializeApollo(state), [state])
    return store
}

export function addApolloState(client, pageProps) {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
    }

    return pageProps
}