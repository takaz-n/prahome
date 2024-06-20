import { useEffect, useState, ChangeEvent } from "react";
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
import zod from "zod";

type Types = {
  CODE: number;
  NAME: string;
};

type AddTypes = {
  CODE: number;
  NAME: string;
};

const Sub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<AddTypes>;

  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post("/api/page/pass", { password });
      if (response.data.success) {
        setIsAuthenticated(true);
        // 削除処理をここに追加
        console.log("認証成功");
      } else {
        setIsAuthenticated(false);
        console.log("認証失敗");
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
    setShow(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setShow(true);
        }}
      >
        削除
      </Button>

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
          <Button onClick={() => setShow(false)} color="primary">
            キャンセル
          </Button>
          <Button onClick={handlePasswordSubmit} color="primary">
            送信
          </Button>
        </DialogActions>
      </Dialog>

      {isAuthenticated && (
        <div>
          <p>削除が認証されました。必要な削除処理をここで実行します。</p>
          {/* 削除処理の内容を追加 */}
        </div>
      )}
    </div>
  );
};
