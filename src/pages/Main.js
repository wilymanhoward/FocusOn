import React, {useState, useContext, useRef, useEffect} from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { addTask, getTask, deleteTask } from "../api";
import {AuthContext} from '../context/AuthContext';
import { confirmAlert } from 'react-confirm-alert';
import { Dialog, DialogContent, DialogActions} from '@material-ui/core'
import { Delete, DeleteOutline, Publish, Share }from '@material-ui/icons'
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: '100vh'
    },
    paper: {
        width: "100%",
        height: "70px",
        backgroundColor: "#2C3333",
        
    },
    title: {
        color: '#E7F6F2',
        textAlign: 'center',
        fontSize: '46px',
    },
    background: {
        width: "auto",
        height: "auto",
        backgroundColor: "#2C3333",
    },
    timer: {
        marginTop: "70px",
        width: "470px",
        height: "250px",
        marginLeft: "400px",
        backgroundColor: "#395B64",
        borderRadius: "10px"
    },
    backgroundColor: {
        backgroundColor: "#2C3333",
        height: "auto"
    },
    countdown: {
        color: '#E7F6F2',
        textAlign: 'center',
        fontSize: '120px',
        top: "10px",
        marginTop: '30px',
    },
    button: {
        marginLeft: '200px',
        backgroundColor: '#E7F6F2',
    },
    Typography: {
        color: '#E7F6F2',
        textAlign: 'center',
        fontSize: '20px',

    },

    TextField: {
        marginLeft: '400px',
        width: '470px',
        backgroundColor: '#E7F6F2',
        borderRadius: "10px",
    },
    Submit: {
        backgroundColor : '#E7F6F2',
        marginTop: '80px',
        marginLeft: '-290px',
    },

    taskContainer: {
        position: 'relative',
        // hover effect => mouse move over the container
        '&:hover $checkbox' : {
            display: 'block'
        }
    },
    
    checkbox: {
        position: 'absolute',
        top:'5px',
        left: '400px',
        zIndex: 30,
        
        
    },

    columnTask: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: ' flex-start',
        width: '98%',
        marginTop: '30px',
    },

    taskBox:{
        marginLeft: '400px',
        marginTop: '0px',
        cursor: 'pointer',
        color: 'black',
        backgroundColor : '#E7F6F2',
        width: '470px',
        borderRadius: '10px',
        textAlign: 'center',
        height: '70px',
    },

    removeIcon: {
        position: 'absolute',
        right: '380px',
        top: '5px',
        cursor: 'pointer',
        color: 'red',
    },

    Buttondelete: {
        textAlign: 'center',
    }
    
}));

function Main(props) {

    const [InputTask, setInputTask] = useState('');
    const classes = useStyles();
    const [taskList, setTaskList] = useState([]);
    const Ref = useRef(null);
    const [selectedTask, setSelectedTask] = useState([])
    const [timer, setTimer] = useState('25:00');
    const { userData } = useContext(AuthContext)
    const [task, setTask] = useState(null);
    const [confimDelete, setConfirmDelete] = useState(false);
   

    useEffect(() => {

        // Get all Task from database
        if (userData)
        {
            getTask(userData).then((array) => {
                setTaskList(array);
            })
        }
    }, [])
    //useEffect(() => {
        
    //})
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000/ 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    const startTimer = (e) => {
        let { total, minutes, seconds }
                    = getTimeRemaining(e);
        if (total >= 0) {

            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }
    const clearTimer = (e) => {
        setTimer('25:00');

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }

    const getDeadTime = () => {
        let deadline = new Date();

        deadline.setSeconds(deadline.getSeconds() + 1500);
        return deadline;
    }

    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);

    const onClickReset = () => {
        clearTimer(getDeadTime());
    }

    const onChangeTask = (event) => {
        setInputTask(event.target.value)
        console.log("InputTask:", InputTask)
    }
    const onUploadTask = (event) => {
        addTask(InputTask, userData).then((res) => {
            console.log("Insert TaskDB success", res)
        })
        .catch((err) => console.log("Insert TaskDB failed, err", err))
        updatetasklist()
    }
    
    const onSelectTask = (e) => {
        console.log(e.target.file)
        setTask(e.target.files[0])
    }

    const onDeleteClick = (taskid) => {
        setSelectedTask(taskid);
        setConfirmDelete(true);
    }

    const onCloseDeleteClick = (task) => {
        setConfirmDelete(false);
    }

    const onChecked = (e, id) => {
        if (e.target.checked) // if this photo checkbox selected
		{
			// get current selected Id array
			// and append this id into the selected id array
			// original long way:
			// let new_array = []
			// for (let i =0; i < selectedTask.length; ++i)
			// new_array.push(selectedTask[i])
			// new_array.push(id)
			
			// shortcut: using destructurized operator ...
            // ... membuat memory baru supaya tidak mengganggu array lain
			let new_array = [...selectedTask, id]
			setSelectedTask(new_array)
            console.log(new_array)
		}
		else
		{
            // filter out the id that has been unchecked
            // .filter(item => condition)
            let new_array = selectedTask.filter(item => item !== id);
			setSelectedTask(new_array)
            console.log(new_array)

		}

    }

    const deletingtask = () => {
        deleteTask(selectedTask)
        onCloseDeleteClick()
        updatetasklist()
        alert('Delete success')
        

    }

    const updatetasklist = () => {
        getTask(userData).then((array) => {
            setTaskList(array);
        })
    }
    console.log("selectedtask:", selectedTask)
    
    return(
        <div className={classes.backgroundColor}>
            <Paper elevation={2} className={classes.paper} square>
                <Typography variant="h4" className={classes.title}>FocusOn</Typography>
            </Paper>

            <Paper elevation={10} className={classes.timer}>
                <Typography variant="h4" className={classes.countdown}>
                    {timer}
                </Typography>
                <Button classvariant="contained" color="secondary" size="Large" className={classes.button} onClick={onClickReset}>START</Button>
            </Paper>

            <Typography className={classes.Typography}>#1</Typography>
            <Typography variant="h2" className={classes.Typography}>Time To Focus!</Typography>
             
            <TextField id="outlined-basic" label="Add Task" variant="outlined" className={classes.TextField} onChange={onChangeTask} />

            <Button className={classes.Submit} onClick={onUploadTask}>Submit Task</Button>
            
            
            <div className={classes.columnTask}>
            {
                taskList.map((item) =>
                    <div className={classes.taskContainer}>
                        <h2 className={classes.taskBox}>{item.Task}</h2>

                        <input
                            type="checkbox"
                            className={classes.checkbox}
                            style={{display: (selectedTask.includes(item.id) ? 'block' : null)}}
                            onChange={(e) => onChecked(e, item.id)}
                        />

                        {
                            selectedTask.length > 0 ?
                            <>
                            <Delete className={classes.removeIcon} onClick={(e) =>onDeleteClick(item.id)}/>
                            </> : null
                        },
                        
                    </div>
                )
            }
            </div>

            <Dialog open={confimDelete} onClose={onCloseDeleteClick} maxWidth="xl">
                <DialogContent>
                    <h2>Confirm to delete the task?</h2>

                    <div className={classes.Buttondelete}>
                        <Button onClick={deletingtask} variant="contained" color="primary">
                            Yes
                        </Button>
                        <Button onClick={onCloseDeleteClick} variant="contained" color="secondary" >
                            No
                        </Button>
                    </div>
                    
                </DialogContent>
                
            </Dialog>
        </div>
        
    )
}

export default Main;
