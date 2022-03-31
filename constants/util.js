import {gql} from '@apollo/client'
import logger from "../lib/logger";

const Views = {
    Home: {
        path: "/",
        ssr: "/",
        pro: false
    },
    Categories: {
        path: "/cats",
        ssr: "/cats",
        pro: false
    },
    ProHome: {
        path: "/pro/home",
        ssr: "/pro/home",
        pro: true
    },
    AssignShop: {
        path: "/pro/assign",
        ssr: "/pro/assign",
        pro: true
    },
    Billing: {
        path: "/pro/billing",
        ssr: "/pro/billing/:egId",
        values: {egid: {notNull: true}},
        pro: true
    },
    ProAdmin: {
        path: "/pro/eg/admin",
        ssr: "/pro/eg/:egId/admin",
        pro: true
    },
    ProOrders: {
        path: "/pro/eg/orders",
        ssr: "/pro/eg/:egId/orders",
        pro: true
    },
    ProEntityGroupTickets: {
        path: "/pro/eg/issues",
        ssr: "/pro/eg/issues/:state/:egId/",
        pro: true
    },
    ProEntityTicketDetail: {
        path: "/pro/eg/detail",
        ssr: "/pro/eg/:egId/entity/:entityId/issue/:issueId/:state",
        pro: true
    },
    ProEntityTickets: {
        path: "/pro/issues/:egid/:eid/:state",
        pro: true
    },
    Terms: {
        path: "/legal/terms",
        ssr: "/legal/terms",
        values: {},
        pro: false
    },
    PrivacyPolicy: {
        path: "/legal/privacy_policy",
        ssr: "/legal/privacy_policy",
        values: {},
        pro: false
    },
    CategoryEntities: {
        path: "/entity/home",
        ssr: "/entity/home/:cat",
        values: {cat: {notNull: false}},
        pro: false
    },
    SubCategoryList: {
        path: "/category/list",
        ssr: "/category/list/:parent",
        values: {parent: {notNull: true}},
        pro: false
    },
    MyIssues: {
        path: "/issue/my",
        ssr: "/issue/my",
        values: {},
        pro: false
    },
    SearchEntity: {
        path: "/entity/search",
        ssr: '/entity/search/:name/:city/:lng/:lat',
        values: {
            name: {},
            city: {},
            lng: {},
            lat: {}
        },
        pro: false
    },
    Entity: {
        path: "/entity/detail",
        ssr: "/entity/detail/:entityId",
        values: {
            entityId: {notNull: true}
        },
        pro: false
    },
    Issue: {
        path: "/issue/detail",
        ssr: "/entity/:entityId/issue/:issueId",
        values: {
            entityId: {notNull: true},
            issueId: {notNull: true}
        },
        pro: false
    },
    EditIssue: {
        path: "/issue/edit",
        ssr: "/request/:issueId/edit",
        values: {
            issueId: {notNull: true}
        },
        pro: false
    },
    NewShop: {
        path: "/pro/eg/create",
        ssr: "/pro/eg/create/:name",
        values: {
            kind: {notNull: true},
            name: {}
        },
        pro: false
    },

    values: [],
    /**
     * filter enum elems that have a path attribute and add them a name then freeze the enum
     */
    init: () => {
        Object.entries(Views).filter(([, {path}]) => path !== undefined).map((params) => {
            const view = Views[params[0]];
            Views.values.push(view)
            view.name = params[0]
            return params
            // console.log( Views.evaluate(view.path, {kind:"myKind", eid:"MyEid", issueId:"MyIssueId", name:"MyName"}) )
        })
        Object.freeze(Views)
    },
    evaluate: (path, values) => {
        const readValue = (_, varName) => {
            if (values == null) return null

            return values[varName];
        }
        path.replace(/:(\w+)/g, readValue)
    },
    prepareLinkParams: (view, values) => {
        const ssr = Views.evaluate(view.ssr, values);
        return {
            href: {
                pathname: view.path,
                query: values
            },
            as: ssr
        }
    },
    validate: (valuesDefs, values) => {
        const required = Object.entries(valuesDefs)
            .filter(([, {notNull}]) => notNull)
            .map(([key]) => key);
        if (!required.every(prop => values.hasOwnProperty(prop))) throw new Error('required missing ' + valuesDefs + ' : ' + values);
    },
    updateCache: async (client, values) => {
        const LOCAL_CACHE = gql`
			query localCache {
				kind @client
				name @client
				eid @client
				issueId @client
				view @client
				egid @client
				state @client
			}
		`

        // Views.validate(view.values, values)
        let localCache = await client.query({
            query: LOCAL_CACHE,
            variables: {}
        })
        // console.log("######## received values ", values)
        // console.log("########    cache values ", localCache.data)
        const combinedValues = Object.assign({}, localCache.data, values)
        // console.log("\t######## combined values ", combinedValues)
        await client.writeData({data: combinedValues})
        return combinedValues;
    },
    findViewByPath(path) {
        for (let i = 0; i < Views.values.length; i++) {
            if (Views.values[i].path === path) return Views.values[i]
        }
        return null
    },
}
Views.init()


function popupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    let dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;

    let left = ((width / 2) - (w / 2)) + dualScreenLeft;
    let top = ((height / 2) - (h / 2)) + dualScreenTop;
    let newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}


function isLoggedIn() {
    try {
        if (localStorage == null) {
            print("it should never enter this line : line above should throw if localStorage is not available")
        }
    } catch (e) {
        return false
    }

    const bearer = localStorage.getItem('bearer');

    return bearer != null
}

function isSuperAdmin(session) {
    if (!session)
        return false

    const loggedUser = session.user;
    return loggedUser.email === process.env.SUPER_USER_MAIL;
}

function login() {
    popupCenter('/login', 'login', 800, 600)
}


function logOut() {
    localStorage.removeItem('bearer')
    localStorage.removeItem('user')
    window.location.reload()
}


function getLoggedUser() {
    const empty = {
        facebook: {},
        picture: ''
    }
    //check if local storage is available
    try {
        if (localStorage == null) throw new Error("it should never enter this line : line above should throw if localStorage is not available")
    } catch (e) {
        return empty
    }

    const userJson = localStorage.getItem('user');
    if (userJson == null) {
        return empty
    }

    try {
        return JSON.parse(decodeURIComponent(userJson))
    } catch (e) {
        console.log(e)
        return empty
    }
}

/**
 * returns the role of the logged user in the entityGroup
 * @param entityGroup
 */
function roleInGroup(entityGroup) {
    const loggedUser = getLoggedUser()
    if (loggedUser.id == null) return null

    const roleInGroup = entityGroup.userList.find(user => {
        return (user.userId == loggedUser.id)
    })
    return roleInGroup
}


function copyFields(source, target, fieldNamesArray) {
    logger.debug("copying fields: ", fieldNamesArray)
    fieldNamesArray.keys.forEach((key) => {
        target[key] = source[key]
    })
    return target
}

function buildCopy(source, fieldSet) {
    const target = {...source}
    Object.keys(fieldSet).forEach((key) => {
        target[key] = fieldSet[key]
    })
    return target
}

function defaultIfNull(source, fieldNamesArray, defaultValue) {
    fieldNamesArray.forEach((key) => {
        if (source[key] === undefined || source[key] == null)
            source[key] = defaultValue
    })
}

function stop(e) {
    if(e) {
        e.preventDefault()
        e.stopPropagation()
    }
}

export {
    Views,
    getLoggedUser,
    isSuperAdmin,
    logOut,
    popupCenter,
    login,
    isLoggedIn,
    roleInGroup,
    copyFields,
    buildCopy,
    defaultIfNull,
    stop
}

export function isSSR() {
    return typeof window === 'undefined'
}

export function getBrowserStorage() {
    if(isSSR())
        return null

    return window.localStorage;
}

export function getFullUrl(req, fallback) {
    //server side request object(req)
    if (req) {
        return "https://" + req.headers.host + req.url

    } //making sure we are on the client side
    else if (!(typeof window === 'undefined')) {
        return window.location.href

    } else {
        return ""
    }
}