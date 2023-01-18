import React, {useState, useContext} from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../context/AuthContext';
import { createdUser, login } from '../api'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: '100vh' // vh is view height, vw: view width; 100vh means use 100% of view height
    },
    paper: {
        width: '300px'
    },
    title: {
        marginTop: '30px',
        marginBottom: '30px'
    },
    inputText: {
        marginTop: '20px'
    },
    button: {
        marginTop: '30px',
        marginBottom: '30px'
    }
}));

function Loginform(props) {

    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const { updateUserData } = useContext(AuthContext)
    
    const onChangeUsername = (event) => {
        setUsername(event.target.value)
    }

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }

    const onSubmit = (event) => {
        if (Username !== '' && Password !== '')
        {
            login(Username, Password).then(() => {
                updateUserData(Username);
                props.history.push('/dashboard')
            })
            .catch((err) => console.log(err))
        }
        else
        {
            alert('Username and password field are required')
        }
    }
    
    

    const classes = useStyles();
    return (
        <Grid
            container
            xs={12}
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={classes.root}
        >
            <Paper
                variant="outlined"
                elevation={3}
                className={classes.paper}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography variant="h4" className={classes.title}> Login </Typography>
                    <TextField 
                        variant="outlined" 
                        placeholder="Username" 
                        color="primary"
                        size="small"
                        className={classes.inputText}
                        onChange={onChangeUsername}
                    />
                    <TextField 
                        variant="outlined" 
                        placeholder="Password" 
                        size="small"
                        type="password"
                        className={classes.inputText}
                        onChange={onChangePassword}
                    />
                    <Button 
                        size="small"
                        variant="contained" 
                        color="primary"
                        className={classes.button}
                        onClick={onSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Paper>
        </Grid>
    )
}

export default Loginform;