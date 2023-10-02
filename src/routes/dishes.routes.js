const { Router, request, response } = require("express")

const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesController = new DishesController()
const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)


dishesRoutes.patch("/picture", upload.single("picture"), (request, response) => {
    console.log(request.file.filename)
    response.json()
})
dishesRoutes.get("/", dishesController.index)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.post("/:user_id", ensureAuthenticated, dishesController.create)
dishesRoutes.put("/", dishesController.update)
dishesRoutes.delete("/:id", dishesController.delete)

module.exports = dishesRoutes