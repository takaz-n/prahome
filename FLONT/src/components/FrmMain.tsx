import {Paper, Card,Button} from "@mui/material"
import { useState,useEffect } from "react";
import { DataGrid ,GridColDef,GridRowParams} from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import axios from "axios";
type table ={
    CODE:string;
    NAME:string;
}
export default function Main(){
 
 const [table,setTable]=useState<table[]>([])
 const nav = useNavigate();
 useEffect(()=>{
    fetchTable();
 },[]);

 const fetchTable = async ()=>{
    try{const res = await axios.get();
        setTable(res.data);
        console.log("テーブル"+table);
    }
    catch(error){console.log(error)};
 }

 const wClick =(params:GridRowParams)=>{
    const {CODE,NAME} = params.row;
    nav("/sub",{state:{code:CODE,name:NAME}});
 }
 const btnClick =()=>{
    nav("/sub");
 }
 const columns: GridColDef[] = [
    { field: "CODE", headerName: "コード", width: 200 },
    { field: "NAME", headerName: "名前", width: 400 },
  ];
    return(
        <div>
            <Paper square={false} elevation={24}>
                <Card square={false} elevation={15}>
                   <DataGrid
                   rows={table}
                   columns={columns}
                   getRowId={(row)=>row.CODE} 
                   onRowDoubleClick={wClick}
                   />
                </Card>
                <Button onClick={btnClick}variant="contained"color="success">登録</Button>
            </Paper>
        </div>
    )
}