import { Grid, Card, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
type table = {
  CODE: string;
  NAME: string;
};
export default function Main() {
  const [table, setTable] = useState<table[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get/page");
      setTable(res.data.data);
      console.log("テーブル" + table);
    } catch (error) {
      console.log(error);
    }
  };

  const wClick = (params: GridRowParams) => {
    const { CODE, NAME } = params.row;
    nav("/sub", { state: { code: CODE, name: NAME } });
  };
  const btnClick = () => {
    nav("/sub");
  };
  const columns: GridColDef[] = [
    { field: "CODE", headerName: "コード", width: 200 },
    { field: "NAME", headerName: "名前", width: 400 },
  ];
  return (
    <div>
      <motion.h1
        initial={{ x: "-100%" }}
        animate={{ x: 700 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: "36px" ,color:"#248f59"}}
      >
        登録リスト
      </motion.h1>
      <Grid container spacing={3}>
        <Grid item xs={8} container justifyContent="center" alignItems="center">
          <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 200 }}
              transition={{ duration: 0.5 }}>
          <Card
            square={false}
            elevation={15}
            style={{ width: "100%", height: "700px" }}
          >
            <DataGrid
              rows={table}
              columns={columns}
              getRowId={(row) => row.CODE}
              onRowDoubleClick={wClick}
              style={{ height: "100%", width: "100%" ,color:"#248f59",backgroundColor:"#ffebcd"}}
            />
          </Card>
          </motion.div>
        </Grid>
        <Grid item xs={4} container justifyContent="center" alignItems="center">
          <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1.0}}>
          <Button
            onClick={btnClick}
            variant="contained"
            color="success"
            size="large"
            sx={{ width: '200px', height: '60px' }} 
          >
            登録
          </Button>
          </motion.div>
        </Grid>
      </Grid>
    </div>
  );
}
