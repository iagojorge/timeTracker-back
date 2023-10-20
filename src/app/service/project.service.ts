import { ProjectRequest } from "../dto/request/project.request";
import { IProject, Project } from "../models/Project";

class ProjectService {
  addProject = async (projectRequest: ProjectRequest) => {
    const { name, userId } = projectRequest;
    const project: IProject = new Project({ name, userId });
    return project.save();
  };

  editProject = async (req: Request, res: Response) => {};
  listProjects = async (req: Request, res: Response) => {};
  deleteProject = async (req: Request, res: Response) => {};
}

export default ProjectService;
