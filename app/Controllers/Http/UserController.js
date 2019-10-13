"use strict";

const User = use("App/Models/User");

const { validateAll } = use("Validator");

class UserController {
  async create({ request, response }) {
    try {
      const errorMessage = {
        "username.required": "Username é obrigatório!",
        "username.unique": "Usuário já cadastrado!",
        "username.min": "O username deve ter ao menos 5 caracteres"
      };
      const validation = await validateAll(
        request.all(),
        {
          username: "required|min:5|max:100|unique:users",
          email: "required|email|unique:users",
          password: "required|min:6"
        },
        errorMessage
      );

      if (validation.fails()) {
        return response.status(400).send({ message: validation.messages() });
      }

      const data = request.only(["username", "email", "password"]);

      const user = await User.create(data);

      return user;
    } catch (error) {
      //return response.status(400).json({ error: "User cannot create!" });
    }
  }

  async login({ request, response, auth }) {
    try {
      const { email, password } = request.all();

      const validaToken = await auth.attempt(email, password);

      return validaToken;
    } catch (error) {
      return response.status(400).json({ error: "Error with User login" });
    }
  }
}

module.exports = UserController;
