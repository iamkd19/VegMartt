const express=require('express');
const connectDB=require('./config/db');
const cors=require('cors');

const products=require('./routes/api/products');
const auth=require('./routes/api/auth');
const cart=require('./routes/api/cart');
const payment=require('./routes/api/payment');
const seller=require('./routes/api/seller');
const order=require('./routes/api/order');
const review=require('./routes/api/review');
const fullname=require('./routes/api/fullname');
const address=require('./routes/api/address');

const app=express();
connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.get('/',(req,res)=>res.send('Hello World!'));

app.use('/auth', auth);
app.use('/products', products);
app.use('/add2cart', cart);
app.use('/payment', payment);
app.use('/seller', seller);
app.use('/order', order);
app.use('/review', review);
app.use('/fullname', fullname);
app.use('/address', address);

const port=process.env.PORT || 8082;
app.listen(port,()=>console.log(`Server running on port http://localhost:${port}`));