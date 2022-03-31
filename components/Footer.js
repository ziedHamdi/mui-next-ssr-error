import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import React from "react";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    copyright: {
        paddingTop: theme.spacing(1),
        marginTop: theme.spacing(1),
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        [theme.breakpoints.down('md')]: {
            border: 'none',
            marginTop: theme.spacing(1)
        }
    }
}))
const footers = [
    // {
    //     title: 'Company',
    //     description: ['Team', 'History', 'Contact us'],
    // },
    // {
    //     title: 'Values',
    //     description: ['Kind is smart', 'Fair is safe', 'Wisdom is long term'],
    // },
    // {
    //     title: 'Articles',
    //     description: ['Blog', 'Newsletter', 'Media'],
    // },
    // {
    //     title: 'Legal',
    //     description: ['Privacy policy', 'Terms of use'],
    // },
];

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://weally.org/" underline="hover">
                WeAlly.org
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Footer(props) {
    const {classes} = useStyles();

    return (
        <>
            <Grid container justifyContent="space-evenly">
                {footers.map((footer) => (
                    <Grid item xs={6} sm={3} key={footer.title}>
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                            {footer.title}
                        </Typography>
                        <ul>
                            {footer.description.map((item) => (
                                <li key={item}>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {item}
                                    </Typography>
                                    {/*<Link variant="subtitle1" color="textSecondary">*/}
                                    {/*    {item}*/}
                                    {/*</Link>*/}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.copyright}>
                <Copyright/>
            </div>
        </>
    )
}