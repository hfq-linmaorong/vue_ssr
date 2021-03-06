const koa = require('koa')
const app = new koa()
const send = require('koa-send')
const path = require('path')
//const static = require('koa-static')

const isDev = process.env.NODE_ENV === 'development'

const staticRouter = require('./routers/static')

//app.use(static(__dirname,'../dist'))
app.use(async (ctx, next) => {
  try {
    console.log(`path: ${ctx.path}`)
    await next()
  } catch (e) {
    console.log(e)
    if (isDev) {
      ctx.body = e.message
    } else {
      ctx.body = e.message
//      throw e.message
    }
  }
})

app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', {root: path.join(__dirname, '../')})
  } else {
    await next()
  }
})
let pageRouter
console.log(isDev)

if (isDev) {
  pageRouter = require('./routers/dev-ssr')
} else {
  pageRouter = require('./routers/ssr')
}
app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())


const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || '3000'

app.listen(PORT, HOST, () => {
  console.log(`server is running  on ${HOST}:${PORT}`)
})
