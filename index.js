const express=require('express');
const app=express();

require('dotenv').config();
const PORT=process.env.PORT || 4000;

//cookie parser middleware
const cookieParser=require('cookie-parser');
app.use(cookieParser());
 
app.use(express.json());

require('./config/database').connect();

//Importing routes and mounting
const user=require('./routes/user');
app.use('/api/v1',user);

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});

