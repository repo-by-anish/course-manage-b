require("dotenv").config();
require("express-async-errors")
const express= require("express");
const mongoose=require("mongoose")

const path=require("path")
const cookieParser=require("cookie-parser")
const cors=require("cors");
const dbConnect = require("./config/dbConnect");
const { logEvent, logger } = require("./middleware/logger");
const corsOption=require("./config/corsOptions")
const app= express();
const PORT=process.env.PORT||3500
dbConnect()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true"); // add this line to enable credentials
    next();
});

app.use(cors(corsOption));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(express.json());
app.use(cookieParser())
app.use(logger);
app.use("/",require("./routes/root"))

app.use("/auth/student",require("./routes/studentAuthRoute"))
app.use("/auth/principal",require("./routes/principalAuthRoutes"))
app.use("/auth/instructor",require("./routes/instructorAuthRoutes"))
app.use("/auth/admin",require("./routes/adminAuthRoutes"))
app.use("/student",require("./routes/studentRoutes"))
app.use("/course",require("./routes/courseRoutes"))
app.use("/instructor",require("./routes/instructorRoutes"))
app.use("/admin",require("./routes/adminRoutes"))
app.use("/principal",require("./routes/principalRoutes"))
app.use("/assignment",require("./routes/assignmentRoutes"))

mongoose.connection.once("open",()=>{
    console.log("Connected to DB");
    app.listen(PORT,()=>console.log(`Listning on PORT:${PORT}`));
})

mongoose.connection.on("error",err=>{
    console.log(err);
    logEvent(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log");
})
