const { Router } = require("express")

const usersRouter = require("./users.routes")
const dishesRoutes = require("./dishes.routes")
const sessionsRouter = require("./sessions.routes")

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/dishes", dishesRoutes)
routes.use("/sessions", sessionsRouter)


module.exports = routes