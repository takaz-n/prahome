import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import zod, { boolean } from "zod";
import { Code } from "@mui/icons-material";

const Sub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const { code, name } = location.state || {};

  const [textC, setTextC] = useState<string>(code || "");
  const [textN, setTextN] = useState<string>(name || "");
  const [isEdit, setIsEdit] = useState(false);

  const addDatas = async () => {
    try{await axios
      .post("http://localhost:3000/api/post/page", {
        data: { code: textC, name: textN },
      })
      alert("登録が成功しました");
      navigate("/");}

      catch(error)  {
        console.log(error);
        alert("追加が失敗しました");
      };
  };

  const editDatas = async () => {
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
        data: { code:textC },
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
      const response = await axios.post("http://localhost:3000/api/page/pass", {data:{password}});
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

  return (
    <div>
      <TextField value={textC} variant="outlined"  onChange={(e)=>{setTextC(e.target.value)}}/>
      <TextField
        value={textN}
        variant="outlined"
        onChange={(e) => {
          setTextN(e.target.value);
          console.log(textN);
        }}
      />
      <Button onClick={handleSubmit(isEdit ? addDatas : editDatas)}>
        {isEdit ? "登録" : "更新"}
      </Button>
      <Button>戻る</Button>
      {!isEdit && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setShow(true);
          }}
        >
          削除
        </Button>
      )}
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
          <p>削除が認証されました。必要な削除処理をここで実行します。</p>
        </div>
      )}
    </div>
  );
};
export default Sub;
