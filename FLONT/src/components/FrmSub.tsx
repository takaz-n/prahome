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
     



    return(
    <div>
        

    </div>
    )
}