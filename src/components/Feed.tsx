import React, { useState, useEffect } from "react";
import styles from "./Feed.module.css";
import { auth, db } from "../firebase";
import TweetInput from "./TweetInput";
import Post from './Post'

const Feed: React.FC = () => {
    const [posts, setPosts] = useState([
        {
            id: "",
            userID: "",
            roomNo: "",
            text: "",
            timestamp: null,
            userName: "",
        },
    ]);

    useEffect(() => {
        const unSub = db
            .collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        userID: doc.data().userID,
                        roomNo: doc.data().roomNo,
                        text: doc.data().text,
                        timestamp: doc.data().timestamp,
                        userName: doc.data().userName,
                    })),
                ),
            );
        return () => {
            unSub();
        };
    }, []);

    return (
        <div className={styles.feed}>
            <TweetInput />
            {posts.map((post) => (
                <Post 
                    key={post.id} 
                    postId={post.id} 
                    userID={post.userID} 
                    roomNo={post.roomNo} 
                    text={post.text} 
                    timestamp={post.timestamp} 
                    userName={post.userName}/>
            ))}
            <button onClick={() => auth.signOut()}>ログアウト</button>
        </div>
    );
};

export default Feed;
