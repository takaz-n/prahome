import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Code } from "@mui/icons-material";

const Sub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const { code, name } = location.state || {};

  const [textC, setTextC] = useState<string>(code || "");
  const [textN, setTextN] = useState<string>(name || "");
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    if (textC === code) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [textC]);
  const addDatas = async () => {
    if(!textC || !textN){
      alert("コードまたは名前を入力してください");
      return;}
      const response = await axios.post("http://localhost:3000/api/post/page", {
        data: { code: textC, name: textN },
      });
      console.log(response.data.data.affectedRows)
       if(response.data.data.affectedRows === 0){
        alert("登録が失敗しました");
      }else{
        alert("登録が成功しました");
        navigate("/");
      }
    } 

  const editDatas = async () => {
    if(!textC || !textN){
      alert("コードまたは名前を入力してください");
      return;}
    try {
      await axios.put("http://localhost:3000/api/put/page", {
        data: { code: textC, name: textN },
      });
      alert("更新が成功しました");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("更新が失敗しました");
    }
  };

  const deleteDatas = async () => {
    try {
      await axios.delete("http://localhost:3000/api/delete/page", {
        data: { code: textC },
      });
      alert("削除が成功しました");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("削除が失敗しました");
    }
  };

  const [show, setShow] = useState(false); //パスワード入力画面表示の有無
  const [password, setPassword] = useState(""); //入力されたパスワードの値を記憶
  const [isOK, setisOK] = useState(false); //パスワードが合致してるかどうか

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/page/pass", {
        data: { password },
      });
      if (response.data.success) {
        setisOK(true);
        // 削除処理をここに追加
        deleteDatas();
        console.log("認証成功");
      } else {
        setisOK(false);
        console.log("認証失敗");
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
    setShow(false);
  };
  const checksetC = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 正しい正規表現を使用
    if (/^\d{0,4}$/.test(value)) {
      setTextC(value);
    }
  };
  const checksetN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^.{0,30}$/.test(value)) {
      setTextN(value);
    }
  };
  const back = () => {
    navigate("/");
  };
  return (
    <div>
      <Grid item xs={11} container direction="column"  alignItems="center" justifyContent="center" style={{marginTop:"300px"}} >
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <TextField value={textC} variant="outlined" onChange={checksetC}  disabled={!isEdit} />
      <Box sx={{ marginBottom: 5 }} />
      <TextField value={textN} variant="outlined" onChange={checksetN} />
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center" style={{marginLeft:"150px", marginTop:"30px"}} >
      <Button variant="contained" size="large" onClick={back} style={{marginRight:"250px"}} >戻る</Button>
      <Button variant ="contained" size="large" onClick={handleSubmit(isEdit ? addDatas : editDatas)}>
        {isEdit ? "登録" : "更新"}
      </Button>
      {!isEdit && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setShow(true);
          }}
          style={{marginLeft:"50px"}}
          size="large"
        >
          削除
        </Button>
      )}
       </Box>
      </Grid>
      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>パスワードを入力してください</DialogTitle>
        <DialogContent>
          <TextField
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            label="パスワード"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Code />}
            onClick={() => setShow(false)}
            color="primary"
          >
            キャンセル
          </Button>
          <Button onClick={handlePasswordSubmit} color="primary">
            送信
          </Button>
        </DialogActions>
      </Dialog>

      {isOK && (
        <div>
          <p>削除が認証されました</p>
        </div>
      )}
    </div>
  );
};
export default Sub;
