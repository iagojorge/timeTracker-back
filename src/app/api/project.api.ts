import { Request, Response } from "express";
import BaseApi from "../service/base.api";
import ProjectService from "../service/project.service";

class ProjectApi extends BaseApi {
  private projectService: ProjectService;

  constructor() {
    super();
    this.projectService = new ProjectService();
  }

  addProject = async (req: Request, res: Response) => {
    // try {
    //   const projectRequest: ProjectRequest = req.body as ProjectRequest;
    //   const project = await this.projectService.addProject(projectRequest);
    //   const exemploApiResponse: ApiResponse = {
    //     type: ResponseType.SUCCESS, // Substitua por um valor adequado
    //     message: "Project created successfully!",
    //     data: project,
    //   };
    //   this.sendCreated(res, {
    //     type: ResponseType.SUCCESS, // Substitua por um valor adequado
    //     message: "Project created successfully!",
    //   });
    // } catch (error) {
    //   this.sendInternalServerError(res, {
    //     type: ResponseType.ERROR, // Substitua por um valor adequado
    //     message: "Server error, please try again later!",
    //   });
    // }
  };
}
