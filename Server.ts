import express, { Application, Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MySQL-@NT1122",
    database: "bumon",
  });
connection.connect(err =>{
  if(err){console.log("SQLに接続できません",err);}
  else{console.log("SQLに接続成功！");};
});
const app: Application = express();
const PORT = 8000;

app.use(cors());//フロントエンドからのリクエストのみを許可している
app.use(express.json());//リクエストの本文がjson形式の場合にexpressがそのデータをジャバスクリプトオブジェクトとして利用できる
app.use(express.urlencoded({ extended: true }));//URLエンコードされたリクエストボディを解析するためのミドルウェアを適用

app.get("/get", (req, res) => {
    console.log("getリクエストを受け付けました。");
    const sql = "SELECT code, name FROM bumonmas";
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(500).json({ message: error.message });
        return;
      } else {
        res.status(200).json({ bumons: result });
      }     
    });
  });

  app.get("/get/Sub/:id", (req, res) => {
    const { id }=req.params; 
    console.log("getリクエストを受け付けました。");
    const sql = "SELECT code, name FROM bumonmas WHERE code = ? ";
    connection.query(sql, [id],(error, result) => {
      if (error) {
        res.status(500).json({ message: error.message });
        return;
      } else {
        res.status(200).json({ bumons: result });
      }     
    });
  });


app.post("/add", (req: Request, res: Response) => {
    console.log("postリクエストを受け付けました。");
    const { code, name } = req.body.data;
    
    const sql = `INSERT INTO bumonmas (code, name) VALUES ("${code}", "${name}")`;
    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add bumon" });
      }
      return res.status(200).json({ ID: code });
    })
  });
  
  
  app.delete("/delete", (req: Request, res: Response) => {
    console.log("deleteリクエストを受け付けました。");
    console.log(req.body);
    const { code } = req.body;
    const sql = `DELETE FROM bumonmas WHERE code = "${code}"`;
    connection.query(sql, (error) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(200).json({ message: "success" });
      }
    });
  });

  app.put("/update", (req: Request, res: Response) => {
    console.log("putリクエストを受け付けました。");
    console.log(req.body.data);
    const { code, name } = req.body.data;
    const sql = `UPDATE bumonmas SET code="${code}", name="${name}" WHERE code="${code}"`
    connection.query(sql, (error) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(200).json({ code, name });
      }
    });
  });

  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
  });
