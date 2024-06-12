import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Grid, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import Sub from "./Sub.tsx"; // サブ画面のインポート
import AndroidIcon from '@mui/icons-material/Android';

type BumonTypes = {
  code: number;
  name: string;
};

const Main: React.FC = () => {
  const [bumons, setBumons] = useState<BumonTypes[]>([]);
  const [inputCode, setInputCode] = useState<number | null>(null); // 部門コードの入力値を格納
  const navigate = useNavigate(); // useNavigateの取得

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get");
        const { bumons } = response.data || { bumons: [] };
        setBumons(Array.isArray(bumons) ? bumons : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setBumons([]); // 空の配列をセット
      }
    };

    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: "code", headerName: "部門コード", width: 150 },
    { field: "name", headerName: "部門名", width: 150 },
  ];

  const handleButtonClick = () => {
    navigate("/sub", { state: { code: inputCode } });
  }

  const handleRowDoubleClick = (params: any) => {
    navigate("/sub", { state: params.row }); // ダブルクリック時に行データを引数としてサブ画面に渡す
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div style={{ height: 900, width: '100%' }}>
            <Paper elevation={24} square={false}>
            <DataGrid
              columns={columns}
              rows={bumons}
              getRowId={(row) => row.code.toString()}
              onRowDoubleClick={handleRowDoubleClick}
              style={{color:"#c71585",backgroundColor:"#000000"}}
            />
            </Paper>
          </div>
        </Grid>
        <Grid item xs={6} container alignItems="center" justifyContent="center">
          <Box display="flex" flexDirection="column" alignItems="center" >
            <TextField
              type="number"
              placeholder="部門コードを入力"
              value={inputCode || ""}
              onChange={(e) => setInputCode(Number(e.target.value))}
              margin="normal"
              style={{color:"#c71585",backgroundColor:"#00ffff"}}
              InputLabelProps={{style:{color:"#c71585"}}}
              label="部門コードです"
            />
            <Box mt={2}>
              <Button onClick={handleButtonClick} variant="contained" color="primary"style={{backgroundColor:"#c71585"}}>
                <AndroidIcon/>
                登録ボタンです
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};


const AppMain: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sub" element={<Sub />} />
      </Routes>
    </Router>
  );
};

export default AppMain;
