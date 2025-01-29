const express = require('express');
const healthCheckRouter = require('./routes/healthCheck');

const app = express();
app.use(express.json());

app.use('/healthz', healthCheckRouter);

app.use((err,req,res,next) =>{
    if(err instanceof SyntaxError && err.status ===400 && 'body' in err){
        
        return res.status(400).send();
    }
});

module.exports = app;