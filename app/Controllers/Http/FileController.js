"use strict";

const File = use("App/Models/File");
const Task = use("App/Models/Task");

const Helpers = use("Helpers");

class FileController {
  async create({ params, request, response, auth }) {
    try {
      const task = await Task.findOrFail(params.id);
      const files = request.file("file", {
        size: "1mb"
      });
      files.moveAll(Helpers.tmpPath("files"), file => {
        name: file.clientName;
      });

      if (!files.moveAll()) {
        return files.errors();
      }
      await Promise.all(
        files
          .movedList()
          .map(file => File.create({ task_id: task.id, path: file.fileName }))
      );
    } catch (error) {
      return response.status(400).send({ error: "Error on upload file" });
    }
  }
}

module.exports = FileController;
