import React, { lazy } from "react";
import icons from "../../contents/Icons";
import CreateProject from "../../pages/Project/Project/CreateProject";
import TaskMaster from "../../pages/Project/TaskMasters/TaskMaster";
import AddTaskCategory from "../../pages/Project/TaskMasters/AddTaskCategory";
import Task from "../../pages/Project/Task/Task";
import MaterialList from "../../pages/Project/Material/MaterialList";
import CreateTask from "../../pages/Project/Task/CreateTask";
import CreateAddTaskCategory from "../../pages/Project/TaskMasters/AddTaskCategory";
import CreateMaterial from "../../pages/Project/Material/MaterialCreate";
import MaterialReturn from "../../pages/Project/MaterialReturn/MaterialReturnList";
import CreateMaterialReturn from "../../pages/Project/MaterialReturn/CreateMaterialReturn";
import ProjectDetail from "../../pages/Project/ProjectDetail/ProjectDetailpage";
import CreateMaterialInOut from "../../pages/Project/ProjectDetail/Compound/MaterialInOutCreate";
import ProjectDashboard from "../../pages/Project/Dashboard/DashBoard";


const Project = lazy(() => import("../../pages/Project/Project/Project"));

export const ProjectRootList = {
  path: "project",
  children: [

    // {
    //   path: "Project/dashboard",
    //   element: <CrmDashboard />,
    // },
    {
      index: true,
      element: <Project />,
    },
    {
      path: "create-project",
      element: <CreateProject />,
    },

    {
      path: "task-masters/",
      children: [
        {
          index: true,
          element: <TaskMaster />,
        },
        {
          path: "add-task-category",
          element: <CreateAddTaskCategory />,
        },
      ],
    },
    {
      path: "task/",
      children: [
        {
          index: true,
          element: <Task />,
        },
        {
          path: "add-task",
          element: <CreateTask />,
        },
      ],
    },
    {
      path: "materials/",
      children: [
        {
          index: true,
          element: <MaterialList />,
        },
        {
          path: "add-material",
          element: <CreateMaterial />,
        },
      ],
    },
    {
      path: "material-return/",
      children: [
        {
          index: true,
          element: <MaterialReturn />,
        },
        {
          path: "add-material-return",
          element: <CreateMaterialReturn />,
        },
      ],
    },
    {
      path: "project-detail/:uuid",
      element: <ProjectDetail />,
    },
    {
      path: "project-detail/create-material-in-out",
      element: <CreateMaterialInOut />,
      
    },

    {
      path: "dashboard",
      element: <ProjectDashboard />,
    }

  ]

  // path: "project",
  // element: <Project />,

};

export const ProjectNavList = {
  title: "Project",
  id: "project",
  icon: React.cloneElement(icons.projectIcon, { size: 18 }),
  submenu: [
    {
      title: "Dashboard",
      id: "dashboard",
      to: "/user/project/dashboard",

   
    },

    {
      title: "project",
      id: "project",
      to: "/user/project",
    },

    {
      title: "Task",
      id: "task",
      to: "/user/project/task",
    },
    {
      title: "Task Masters",
      id: "task_masters",
      to: "/user/project/task-masters",
    },
    {
      title: "Materials",
      id: "materials",
      to: "/user/project/materials",
    },
    {
      title: "Material Return",
      id: "material_return",
      to: "/user/project/material-return",
    },
  ]
  ,
};
