import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";
import { db } from '../firebase'
import firebase from 'firebase/app'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import { makeStyles } from '@material-ui/core/styles'
import MessageIcon from '@material-ui/icons/message'
import SendIcon from '@material-ui/icons/Send'

interface PROPS {
    postId: string;
    userID: string;
    roomNo: string;
    text: string;
    timestamp: any
    userName: string;
}

const Post: React.FC<PROPS> = (props) => {



    return <div className={styles.post}>
        <div className={styles.post_avatar}>
            <label>{props.roomNo}</label>
        </div>
        <div className={styles.post_body}>
            <div>
                <div className={styles.post_header}>  
                    <h3>
                        <span className={styles.post_headerUser}>@{props.userName}</span>
                        <span className={styles.post_headerTime}>
                            {new Date(props.timestamp?.toDate()).toLocaleString()}
                        </span>
                    </h3>
                </div>
                <div className={styles.post_tweet}>
                    <p>{props.text}</p>
                </div>
            </div>
        </div>
    </div>;
};

export default Post;
