import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, db } from "../firebase";

import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    TextField,
    Paper,
    Grid,
    Typography,
    makeStyles,
    Modal,
    IconButton,
    Box,
} from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Email } from "@material-ui/icons";
import { idText } from "typescript";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Auth: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [photoUrl, setphotoUrl] = useState("");
    const [roomNo, setRoomNo] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const signInEmail = async () => {
        const authUser = await auth.signInWithEmailAndPassword(email, password);
        await db
            .collection("customerData")
            .doc(authUser.user?.uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    if (authUser.user!.uid === doc.data()!.id) {
                        dispatch(
                            updateUserProfile({
                                displayName: doc.data()!.name,
                                photoUrl: photoUrl,
                                roomNo: doc.data()!.roomNo,
                            }),
                        );
                    }
                }
            })
            .catch((error) => {
                alert(
                    error.message +
                        ": 認証データの値に異常があります。管理者にお問い合わせください",
                );
            });
    };

    //シークレットキーの削除
    const signUpEmail = async () => {
        await db
            .collection("secretData")
            .doc(roomNo)
            .get()
            .then(async (doc) => {
                if (doc.exists && doc.data()!.key === secretKey) {
                    const authUser = await auth.createUserWithEmailAndPassword(
                        email,
                        password,
                    );
                    await authUser.user?.updateProfile({
                        displayName: username,
                        photoURL: photoUrl,
                    });
                    await db
                        .collection("customerData")
                        .doc(authUser.user?.uid)
                        .set({
                            id: authUser.user?.uid,
                            roomNo: roomNo,
                            name: authUser.user?.displayName,
                            email: authUser.user?.email,
                        });
                    //storeのUpdate
                    dispatch(
                        updateUserProfile({
                            displayName: username,
                            photoUrl: photoUrl,
                            roomNo: roomNo,
                        }),
                    );
                } else {
                    alert(
                        "認証データが一致しません。正しい値を入力してください。",
                    );
                }
            })
            .catch((error) => {
                alert(
                    error.message +
                        ": 認証データの値に異常があります。管理者にお問い合わせください",
                );
            });
    };

    // カスタムプロフィール
    // 新規と既存をどうするか
    // const signInGoogle = async () => {
    //     await auth.signInWithPopup(provider).catch((err) => alert(err.message));
    // };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {isLogin ? "ログイン" : "ユーザー登録"}
                </Typography>
                <form className={classes.form} noValidate>
                    {!isLogin && (
                        <>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="氏名"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setUsername(e.target.value);
                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="roomNo"
                                label="部屋番号"
                                name="roomNo"
                                autoComplete="roomNo"
                                autoFocus
                                value={roomNo}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setRoomNo(e.target.value);
                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="secretKey"
                                label="secretKey"
                                type="password"
                                id="secretKey"
                                autoComplete="secretKey"
                                value={secretKey}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setSecretKey(e.target.value)}
                            />
                        </>
                    )}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                    />
                    <Button
                        disabled={
                            isLogin
                                ? !email || password.length < 6
                                : !username ||
                                  !email ||
                                  password.length < 6 ||
                                  !roomNo ||
                                  !secretKey
                        }
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        startIcon={<EmailIcon />}
                        onClick={
                            isLogin
                                ? async () => {
                                      try {
                                          await signInEmail();
                                      } catch (err) {
                                          alert(err.message);
                                      }
                                  }
                                : async () => {
                                      try {
                                          await signUpEmail();
                                      } catch (err) {
                                          alert(err.message);
                                      }
                                  }
                        }
                    >
                        {isLogin ? "ログイン" : "ユーザー登録"}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <span className={styles.login_reset}>
                                パスワード再設定
                            </span>
                        </Grid>
                        <Grid item>
                            <span
                                className={styles.login_toggleMode}
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin
                                    ? "新規ユーザー登録画面へ"
                                    : "ログイン画面へ"}
                            </span>
                        </Grid>
                    </Grid>
                    {/* <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={signInGoogle}
                    >
                        Googleアカウントでログイン
                    </Button> */}
                </form>
            </div>
        </Container>
    );
};

export default Auth;
