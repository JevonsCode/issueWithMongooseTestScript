const Koa = require('koa');
const koaBody = require('koa-body');
const mongoose = require('mongoose');
const parameter = require('koa-parameter');
const error = require('koa-json-error');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true}, ()=>{
    console.log('🍍 OK')
});
mongoose.connection.on('error', console.error);


const testSchema = new mongoose.Schema({
    __v: { type: Number, select: false },
    A: { type: Number, required: true },
    B: {
        type: [{
            C: { type: Number }
        }],
    }
});
const Test = mongoose.model('Test', testSchema);

app.use(koaBody());

app.use(error({
    postFormat: (e, st) => st
}));

app.use(parameter(app));

router.get('/', async (ctx, next) => {
    ctx.body = await Test.find();
});

router.post('/add', async (ctx) => {
    ctx.verifyParams({
        A: { type: 'number', required: true },
        // B: { type: 'array', required: true },
        B: [{
            C: {type: 'number', required: true }
        }]
        
    });
    const re = await new Test(ctx.request.body).save();
    ctx.body = re;
});

router.patch('/:id', async (ctx) => {
    const re = await Test.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if(!re) { ctx.throw(404, '404'); }
    ctx.body = re;
});

app.use(router.routes()).use(router.allowedMethods()); 

app.listen(3333, () => console.log(
    ' 🍊 🍊 🍊 🍊 🍊 🍊 - POST: 3333 - 🍊 🍊 🍊 🍊 🍊 🍊 '
));
