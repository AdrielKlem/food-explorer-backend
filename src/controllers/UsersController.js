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
        const user = await knex("users").where({id}).first()

        if(!user) {
            throw new AppError("Usuário não encontrado")
        }

        const userWithUpdateEmail = await knex("users").where({email}).first()

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
        
        await knex('users')
        .where({ id })
        .update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: knex.raw('DATETIME("now")')
        })
        .catch(error => {
            throw new AppError('Ocorreu um erro durante a atualização:', error)
        })

        response.status(201).json()
    }
}

module.exports = UsersController