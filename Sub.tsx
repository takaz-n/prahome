import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Grid } from "@mui/material";
import { useForm } from 'react-hook-form';
import axios from 'axios';

type BumonTypes = {
  code: number;
  name: string;
};

type AddBumonTypes = {
  code: number;
  name: string;
};

const Sub: React.FC = () => {
  // urlパラメータを取得
  const location = useLocation();
  // ページ遷移の機能であるuseNavigateをnavigateとして宣言
  const navigate = useNavigate();
  // register(フォームの入力値の管理機能)handleSubmit(フォーム送信の際の機能)reset(フォームの初期化)
  const { register, handleSubmit, reset } = useForm<AddBumonTypes>();
  const [bumons, setBumons] = useState<BumonTypes[]>([]);
  const [isEdit, setIsEdit] = useState<BumonTypes | null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get');
        const { bumons } = response.data || { bumons: [] };
        setBumons(Array.isArray(bumons) ? bumons : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setBumons([]); // 空の配列をセット
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location.state) {
      const { code } = location.state as AddBumonTypes;
      handleGet(code); // サブ画面に来た時点でデータベースに同じコードがあるか確認
    }
  }, [location.state, reset, bumons]);

  const handleGet = async (code: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/get/Sub/${code}`);
      if (response.data.bumons.length > 0) {
        const { name } = response.data.bumons[0];
        reset({ code: Number(code), name });
        setIsEdit({ code: Number(code), name }); // 編集モードにする
      } else {
        reset({ code: Number(code), name: "" });
        setIsEdit(null); // 新規追加モードにする
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addBumon = async (data: AddBumonTypes) => {
    const { code, name } = data;
    await axios
      .post("http://localhost:8000/add", {
        data: { code, name },
      })
      .then((response) => {
        const newBumon = response.data;
        setBumons((prevBumons) => [...prevBumons, newBumon]);
        alert("追加が成功しました");
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
         alert("追加が失敗しました");
      });
  };

  const editBumon = async (data: AddBumonTypes) => {
    const { code, name } = data;
    await axios
      .put("http://localhost:8000/update", {
        data: { code, name },
      })
      .then((response) => {
        const updatedBumon = response.data;
        const newBumons = bumons.map((bumon) =>
          bumon.code === code ? updatedBumon : bumon
        );
        setBumons(newBumons);
        alert("更新が成功しました");
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
         alert("更新が失敗しました");
      });
  };

  const deleteBumon = async (code: number) => {
    await axios
      .delete("http://localhost:8000/delete", {
        data: { code },
      })
      .then(() => {
        const newBumons = bumons.filter((bumon) => bumon.code !== code);
        setBumons(newBumons);
        alert("削除が成功しました");
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        alert("削除が失敗しました");
      });
  };

  return (
    <div>
      <Grid item xs={12} container alignItems="center" justifyContent="center"style={{marginTop:"200px"}}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <TextField
          {...register("code")}
          type="number"
          placeholder="部門コードを入力"
          disabled={!!isEdit} // 編集モードのときはコード入力を無効化
        />
        <Box sx={{ marginBottom: 5 }} /> {/* テキストフィールド間のマージン */}
        <TextField
          {...register("name")}
          type="text"
          placeholder="部門名を入力"
          fullWidth // 部門名のテキストフィールドを横長に設定
        />
      </Box>
      <Box display="flex" flexDirection="column" style={{marginLeft:"50px"}}>
        <Button onClick={handleSubmit(isEdit ? editBumon : addBumon)} type="submit" variant="contained" color="primary">
            {isEdit ? "更新" : "追加"}
          </Button>
          {isEdit && (
            <Button
              onClick={() => deleteBumon(isEdit.code)}
              variant="contained"
              color="secondary"
              style={{marginTop:"10px"}}
            >
              削除
            </Button>
          )}
        <Button onClick={() => navigate(-1)} variant="contained" color="primary" style={{marginTop:"10px"}}>
            閉じる
          </Button>
        </Box>
        </Grid>
     
    </div>
  );
};

export default Sub;
