import { Grid, Card, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

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
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          fontSize: "40px",
          color: "#248f59",
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
          display: "inline-block",
        }}
      >
        PAGEテーブル
      </motion.h1>
      <Grid container spacing={3}>
        <Grid item xs={8} container justifyContent="center" alignItems="center">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 200 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              square={false}
              elevation={24}
              style={{ width: "100%", height: "700px" }}
            >
              <DataGrid
                rows={table}
                columns={columns}
                getRowId={(row) => row.CODE}
                onRowDoubleClick={wClick}
                style={{
                  height: "100%",
                  width: "100%",
                  color: "#248f59",
                  backgroundColor: "#e0ffff",
                }}
              />
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={4} container justifyContent="center" alignItems="center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              startIcon={<GroupAddIcon />}
              onClick={btnClick}
              variant="contained"
              color="success"
              size="large"
              sx={{ width: "200px", height: "60px" }}
              style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.9)" }}
            >
              新規登録
            </Button>
          </motion.div>
        </Grid>
      </Grid>
    </div>
  );
}
