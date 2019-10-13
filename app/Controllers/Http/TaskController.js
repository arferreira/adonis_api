"use strict";

const Task = use("App/Models/Task");

const Database = use("Database");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view, auth }) {
    // const tasks = await Task.query()
    //   .where("user_id", auth.user.id)
    //   .fetch();

    const tasks = Database.select("title", "description")
      .from("tasks")
      .where("user_id", auth.user.id);

    return tasks;
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const { id } = auth.user;

    const data = request.only(["title", "description"]);

    const task = await Task.create({ ...data, user_id: id });

    return task;
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view, auth }) {
    const task = await Task.query()
      .where("id", params.id)
      .where("user_id", auth.user.id)
      .first();

    if (!task) {
      return response.status(404).send({ error: "Task not found!" });
    }

    return task;
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const { title, description } = request.all();

    const task = await Task.query()
      .where("id", params.id)
      .where("user_id", auth.user.id)
      .first();

    if (!task) {
      return response.status(404).send({ error: "Task not found!" });
    }

    task.title = title;
    task.description = description;

    await task.save();

    return task;
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const task = await Task.query()
      .where("id", params.id)
      .where("user_id", auth.user.id)
      .first();

    if (!task) {
      return response.status(404).send({ error: "Task not found!" });
    }

    await task.delete();

    return response.status(200).send({ message: "Task deleted with success!" });
  }
}

module.exports = TaskController;
