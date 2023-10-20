import { Request, Response } from "express";
import Joi from "joi";
import { ResponseType } from "../../shared/enums/response.type";
import { ProjectRequest } from "../dto/request/project.request";
import BaseApi from "../service/base.api";
import ProjectService from "../service/project.service";

class ProjectApi extends BaseApi {
  private projectService: ProjectService;

  constructor() {
    super();
    this.projectService = new ProjectService();
  }

  private projectSchema = Joi.object({
    name: Joi.string().required(),
    userId: Joi.string().required(),
  });

  addProject = async (req: Request, res: Response) => {
    try {
      const projectRequest: ProjectRequest = req.body as ProjectRequest;
      const { error } = this.projectSchema.validate(projectRequest);

      if (error) {
        return this.sendBadRequest(res, error);
      }

      await this.projectService.addProject(projectRequest);

      this.sendCreated(res, {
        type: ResponseType.SUCCESS,
        message: SuccessMessage.PROJECT_CREATED_SUCCESSFULLY,
      });
    } catch (error) {
      return this.sendInternalServerError(res, {
        type: ResponseType.ERROR,
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
      });
    }
  };

  editProject = async (req: Request, res: Response) => {
    try {
      const idProject = req.params.id;
      const projectTime = await this.projectService.findById(idProject);

      if (req.body.timeSpent) {
        projectTime?.timeSpent.push(req.body.timeSpent);
      }

      const project = {
        nome: req.body.name,
        tempoGasto: projectTime?.timeSpent,
      };

      const updatedProject = await this.projectService.findByIdAndUpdate(
        idProject,
        project
      );

      if (!updatedProject) {
        return this.sendNotFound(res, ErrorMessage.PROJECT_NOT_FOUND);
      }
      return this.sendCreated(res, updatedProject);
    } catch (error) {
      return this.sendInternalServerError(res, {
        type: ResponseType.ERROR,
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
      });
    }
  };

  deleteProject = async (req: Request, res: Response) => {
    try {
      const idProject = req.params.id;
      await this.projectService.findByIdAndDelete(idProject);

      this.sendCreated(res, {
        type: ResponseType.SUCCESS,
        message: SuccessMessage.PROJECT_DELETED_SUCCESSFULLY,
      });
    } catch (error) {
      return this.sendNotFound(res, ErrorMessage.PROJECT_NOT_FOUND);
    }
  };
}

export default ProjectApi;
