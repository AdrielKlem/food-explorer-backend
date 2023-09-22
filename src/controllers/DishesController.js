const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class DishesController {
    async create(request, response) {
        const { picture, name, description, price, ingredients } = request.body
        const { user_id } = request.params

      
        await knex("dishes").insert(
            { 
                picture, 
                name, 
                description, 
                price,
                user_id
            })

        response.status(201).json()
    }
}

module.exports = DishesController