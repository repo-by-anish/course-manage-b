const express=require("express");
const router=express.Router()

router.get("^/$|/index(.html)?",(req,res)=>{
    res.send("Hello CRS");
})

module.exports= router