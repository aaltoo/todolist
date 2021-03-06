import React, {useState} from "react";
import Task from "./Task/Task";
import styles from './TaskList.module.css'
import {useAddTaskMutation, useFetchTasksQuery} from "../../features/api/tasks-api-slice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setTasks, textChanged, todoAdded} from "../../features/tasks-slice";
import { TaskType } from '../../types/types'

const TaskList: React.FC = (props) => {

    const text = useAppSelector((state) => state.tasks.text)
    const dispatch = useAppDispatch()
    const { data, isFetching, error, isSuccess } = useFetchTasksQuery()
    const [ranBefore, setRanBefore] = useState(false)
    if (data && isSuccess && !ranBefore) {
        dispatch(setTasks(data))
        setRanBefore(true)
    }
    const tasks = useAppSelector((state) => state.tasks.tasks)

    let handleTextChange = (e : any) => {
        dispatch(textChanged(e.target.value))
    }

    const [addTask, { isLoading }] = useAddTaskMutation()

    const submitForm = (e : any) => {
        e.preventDefault()
        const onSuccess = (fulfilled : TaskType) => {
            dispatch(todoAdded(fulfilled))
            dispatch(textChanged(""))
        }
        addTask({text}).unwrap().then(fulfilled => onSuccess(fulfilled)).catch(rejected => console.error(rejected))
    }


    return (
        <>
            <h1 className={styles.title}>To-Do List</h1>
            <div className={styles.taskWrapper}>
                <div className={styles.taskDescription}>
                    <p>task (double click to edit)</p>
                    <div className={styles.rightAlignedBlock}>
                        <p>status</p>
                        <p>delete</p>
                    </div>
                </div>
                <ul className={styles.taskList}>
                    {tasks?.map((task) => {
                        return <Task task={task} key={task.id}
                        />
                    })}
                </ul>
                <form className={styles.inputPanel} onSubmit={submitForm}>
                    <input type="text" value={text} className={styles.inputField} onChange={handleTextChange}/>
                    <button type="submit" disabled={!text} className={styles.submitBtn}>Add</button>
                </form>
            </div>
        </>
    )
}

export default TaskList
