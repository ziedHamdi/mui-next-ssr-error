import { InMemoryCache, makeVar } from '@apollo/client';

export const draftComplaints = makeVar([])

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                draftComplaints: {
                    read() {
                        return draftComplaints();
                    }
                },
                complaintConnection: {
                    keyArgs: ['filter'],
                    merge(existing = [], incoming) {
                        // console.log("merging: existing ", existing.count, " incoming: ", incoming.count)

                        if(existing?.pageInfo  == null)
                            return incoming

                        if(existing.pageInfo.endCursor == incoming.pageInfo.endCursor)
                            return existing

                        return {
                            __typename: "ComplaintConnection",
                            count: existing.count,
                            edges: [...existing.edges, ...incoming.edges],
                            pageInfo: incoming.pageInfo
                        };
                    },
                }
            }
        }
    }
});