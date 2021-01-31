import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth, db } from "../firebase";
import { Button, IconButton } from "@material-ui/core";
import firebase from "firebase/app";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const TweetInput: React.FC = () => {
    const user = useSelector(selectUser);
    const [tweetMsg, setTweetMsg] = useState("");

    const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        db.collection("posts").doc(user.uid).set({
            userID: user.uid,
            roomNo: user.roomNo,
            text: tweetMsg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userName: user.displayName,
        });
        setTweetMsg("");
    };

    return (
        <>
            <form onSubmit={sendTweet}>
                <div className={styles.tweet_form}>
                    <Button
                        className={styles.tweet_avatar}
                        onClick={async () => {
                            await auth.signOut();
                        }}
                    >
                        {user.roomNo}: {user.displayName}
                    </Button>
                    <input
                        className={styles.tweet_input}
                        placeholder="what's happening?"
                        type="text"
                        autoFocus
                        value={tweetMsg}
                        onChange={(e) => setTweetMsg(e.target.value)}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={!tweetMsg}
                    className={
                        tweetMsg
                            ? styles.tweet_sendBtn
                            : styles.tweet_sendDisableBtn
                    }
                >
                    Tweet
                </Button>
            </form>
        </>
    );
};

export default TweetInput;
