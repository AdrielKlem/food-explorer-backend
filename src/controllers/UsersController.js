const { hash, compare } = require("bcryptjs")
const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body

        const checkUserExist = await knex("users").where({email})

        if(checkUserExist.length > 0) {
            throw new AppError("Este email já está em uso")
        }

        const hashedPassword = await hash(password, 8)

        await knex("users").insert({name, email, password: hashedPassword})

        response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body
        const { id } = request.params

        const database = await knex()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if(!user) {
            throw new AppError("Usuário não encontrado")
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
            throw new AppError("Este e-mail existe")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword) {
                throw new AppError("Email ou a senha é inválida")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, id]    
        )

        response.status(201).json()

    }
}

module.exports = UsersController