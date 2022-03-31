import {Avatar, Chip, Container, Grid, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import logger from "../../lib/logger";
import {Loop} from "@mui/icons-material";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        padding: theme.spacing(4),
        alignItems: "center",
        flexWrap: "wrap",
    },
    chip: {
        '&.MuiChip-colorPrimary': {
            backgroundColor: '#fc0031',
            color: 'white'
        },
        '&.MuiChip-colorSecondary': {
            backgroundColor: '#f3be2b',
            // backgroundColor: '#34d178',
            color: '#5d5131'
        },
    },
    message: {
        display: 'block',
        paddingTop: theme.spacing(2)
    },
    error: {
        color: theme.palette.text.secondary
    },
    rotate: {
        transformOrigin: 'center',
        animation: `$rotate 1s linear infinite`
    },
    '@keyframes rotate': {
        "0%": {
            transform: 'rotate(0deg)'
        },
        "100%": {
            transform: 'rotate(360deg)'
        }
    }
}))

export const DEFAULT_STATES = {
    LOADING: {label: 'state.loading', color: "secondary"},
    SAVING: {label: 'state.saving', color: "secondary"},
    ERROR: {label: 'state.error', color: "primary"}
}
export default function DisplayState(props) {
    const {classes} = useStyles()
    const {t} = useTranslation('header')
    let {state, label, color, message, error} = props
    if (state) {
        label = t(state.label)
        color = state.color
    }
    if (state == DEFAULT_STATES.LOADING) {
        return (
            <Container maxWidth="xl" className={classes.root}>
                <Loop className={classes.rotate}/>
            </Container>
        )
    }

    if (error)
        logger.error(error)
    return (
        <Container maxWidth="xl" className={classes.root}>
            <Chip color={color} label={label} className={classes.chip}/>
            {message && (<Typography variant="body1" className={classes.message}>{message}</Typography>)
            }
            {error && <div className={classes.error}>
                <pre>{JSON.stringify(error)}</pre>
            </div>}
        </Container>
    )


}