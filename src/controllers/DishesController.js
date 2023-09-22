class DishesController{
    async create(request, response) {
        const { name, description, price, ingredients } = request.body


        response.status(201).json({ name, description, price, ingredients })
    }

    async update(request, response) {
        response.status(201).json("Tudo certo")
    }
}

module.exports = DishesController