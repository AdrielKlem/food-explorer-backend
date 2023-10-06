const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class DishesController {
    async create(request, response) {
        const { name, description, price, category, ingredients } = request.body
        const user_id = request.user.id
        console.log(request)

        const checkDishAlreadyExists = await knex("dishes").where({name}).first();
    
        const ingredientsArray = ingredients.split(',');

        if(checkDishAlreadyExists){
            throw new AppError("Este prato já existe no cardápio.")
        }

        const pictureFileName = request.file.filename ?? null ;
        const diskStorage = new DiskStorage()
        const filename = await diskStorage.saveFile(pictureFileName);

        const [dish_id] = await knex("dishes").insert(
            { 
                picture:filename, 
                name, 
                description, 
                price,
                category: category ?? "Refeição",
                user_id
            })

        const ingredientsInsert = ingredientsArray.map(ingredient => {
            return {
                name: ingredient,
                dish_id,
                user_id
            }
        })

        await knex("ingredients").insert(ingredientsInsert)

        response.status(201).json()
    }

    async update(request, response) {
        const { name, description, price, category, ingredients } = request.body;
        const { id } = request.params;

        const diskStorage = new DiskStorage();
        const dish = await knex("dishes").where({ id }).first();

        const ingredientsArray = ingredients.split(',');

        if (!dish) {
            return response.status(404).json({ error: "Dish not found" });
        }

        if (request.file) {
            // Se uma nova imagem for fornecida na requisição
            const pictureFileName = request.file.filename;

            // Excluir a imagem antiga, se houver
            if (dish.picture) {
            await diskStorage.deleteFile(dish.picture);
            }

            // Salvar a nova imagem e atualizar o nome no prato
            const filename = await diskStorage.saveFile(pictureFileName);
            dish.picture = filename;
        }

        // Atualizar os outros campos do prato
        dish.name = name ?? dish.name;
        dish.description = description ?? dish.description;
        dish.price = price ?? dish.price;
        dish.category = category ?? dish.category;

        await knex("dishes").where({ id }).update(dish);

        // Inserir ingredientes, se houver
        let ingredientsInsert;
        if (ingredientsArray.length > 0) {
            ingredientsInsert = ingredientsArray.map(ingredient => {
            return {
                dish_id: dish.id,
                name: ingredient
            };
            });

            // Deletar ingredientes antigos e inserir os novos
            await knex("ingredients").where({ dish_id: id }).delete();
            await knex("ingredients").insert(ingredientsInsert);
        }

        return response.status(200).json({ message: "Dish updated successfully" });
        }

    async index(request, response) {
        try {
            const { name, ingredients } = request.query;
                
            // Listing Dishes and Ingredients at the same time (innerJoin)
            let dishes;

            if (ingredients) {
                const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
                
                dishes = await knex("ingredients")
                    .select([
                        "dishes.id",
                        "dishes.name",
                        "dishes.description",
                        "dishes.category",
                        "dishes.price",
                        "dishes.picture",
                    ])
                    .whereLike("dishes.name", `%${name}%`)
                    .whereIn("ingredients.name", filterIngredients)
                    .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                    .groupBy("dishes.id")
                    .orderBy("dishes.name")
            } else {
                dishes = await knex("dishes")
                    .whereLike("name", `%${name}%`)
                    .orderBy("name");
            }
            
            const dishesIngredients = await knex("ingredients") 
            const dishesWithIngredients = dishes.map(dish => {
                const dishIngredient = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);
        
                return {
                    ...dish,
                    ingredients: dishIngredient
                }
            })
            
            return response.status(200).json(dishesWithIngredients);
        } catch (error) {
            response.status(500).json({ error: "An error occurred during the update", details: error.message });
        }
    }

    async show(request, response) {
        const { id } = request.params

        const dish = await knex("dishes").where({ id }).first()
        const ingredients = await knex("ingredients").where({ dish_id: id }).select("*")

        return response.json({
            ...dish,
            ingredients
        })
    }

    async delete(request, response) {
        try {
            const { id } = request.params

            await knex("dishes").where({ id }).delete()
            
            return response.json()
        } catch (error) {
            response.status(500).json({ error: "An error occurred during the update", details: error.message });
        }
    }
}

module.exports = DishesController