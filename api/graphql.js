import {getSession} from "next-auth/react";


function isTrueStr(str) {
    return str === true ||
        (str != null &&
        str.toString().toLowerCase() === 'true')
}

export default async (_req, _res) => {
    return null
};

export function prepareContext(session) {
    return {
        headers: {'infra-token': session?.infraToken ?? ""}
    };
}