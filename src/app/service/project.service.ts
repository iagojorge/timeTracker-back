import { ProjectRequest } from "../dto/request/project.request";
import { IProject, Project } from "../models/Project";

class ProjectService {
  addProject = async (projectRequest: ProjectRequest) => {
    const { name, userId } = projectRequest;
    const project: IProject = new Project({ name, userId });
    return project.save();
  };

  findByIdAndDelete = async (id: any) => {
    try {
      return Project.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  };

  findById = async (id: any) => {
    try {
      return Project.findById(id);
    } catch (error) {
      throw error;
    }
  };

  findByIdAndUpdate = async (id: any, project: any) => {
    try {
      return Project.findByIdAndUpdate(id, project);
    } catch (error) {
      throw error;
    }
  };

  editProject = async (req: Request, res: Response) => {};
  listProjects = async (req: Request, res: Response) => {};
}

export default ProjectService;
