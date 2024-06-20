import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { TextField, Button } from "@mui/material" ;
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
    const [datas, setDatas] = useState<Types[]>([]);
    const [isEdit, setIsEdit] = useState<Types | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5173/api/get/page');
        const { datas } = response.data || { datas: [] };
        setDatas(Array.isArray(datas) ? datas : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDatas([]); // 空の配列をセット
      }
    };

    fetchData();
  }, []);
     
  useEffect(() => {
    if (location.state) {
      const { CODE } = location.state as AddTypes;
      handleGet(CODE); // サブ画面に来た時点でデータベースに同じコードがあるか確認
    }
  }, [location.state, reset, datas]);

  const handleGet = async (CODE: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/get/Sub/${CODE}`);
      if (response.data.datas.length > 0) {
        const { NAME } = response.data.datas[0];
        reset({ CODE: Number(CODE), NAME });
        setIsEdit({ CODE: Number(CODE), NAME }); // 編集モードにする
      } else {
        reset({ CODE: Number(CODE), NAME: "" });
        setIsEdit(null); // 新規追加モードにする
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addDatas = async (data: AddTypes) => {
    const { CODE, NAME } = data;
    await axios
      .post("http://localhost:8000/add", {
        data: { CODE, NAME },
      })
      .then((response) => {
        const newDatas = response.data;
        setDatas((prevDatas) => [...prevDatas, newDatas]);
        alert("追加が成功しました");
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
         alert("追加が失敗しました");
      });
  };

  const editDatas = async (data: AddTypes) => {
    const { CODE, NAME } = data;
    await axios
      .put("http://localhost:8000/update", {
        data: { CODE, NAME },
      })
      .then((response) => {
        const updatedBumon = response.data;
        const newDatas = datas.map((arrayDatas) =>
          arrayDatas.CODE === CODE ? updatedBumon : arrayDatas
        );
        setDatas(newDatas);
        alert("更新が成功しました");
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
         alert("更新が失敗しました");
      });
  };

  const deleteDatas = async (code: number) => {
    await axios
      .delete("http://localhost:8000/delete", {
        data: { CODE },
      })
      .then(() => {
        const newDatas = datas.filter((bumon) => bumon.CODE !== code);
        setBumons(newBumons);
        alert("削除が成功しました");
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        alert("削除が失敗しました");
      });
  };



    return(
    <div>
        

    </div>
    )
}