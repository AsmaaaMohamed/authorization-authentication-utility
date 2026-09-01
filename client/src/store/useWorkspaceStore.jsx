import { create } from "zustand";
import axios from "axios";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
axios.defaults.withCredentials = true;
const dummyWorkspaces = [
  {
    id: "1",
    name: "Product Team",
    role: "Owner",
    members: [
      {
        userId: "101",
        role: "Admin",
        status: "Active",
      },
      {
        userId: "102",
        role: "Member",
        status: "Active",
      },
    ],
    projects: 3,
  },
  {
    id: "2",
    name: "Backend Utils",
    role: "Admin",
    members: [
      {
        id: "201",
        role: "Member",
        status: "Active",
      },
    ],
    projects: 1,
  },
  {
    id: "3",
    name: "Freelance Clients",
    role: "Member",
    members: [
      {
        id: "301",
        role: "Member",
        status: "Active",
      },
    ],
    projects: 5,
  },
];
const dummyUsers = [
  {
    id: "101",
    name: "Ahmed Ali",
    email: "ahmed@gmail.com",
  },
  {
    id: "102",
    name: "Sara Ahmed",
    email: "sara@gmail.com",
  },
  {
    id: "103",
    name: "Ali Hassan",
    email: "ali@gmail.com",
  },
  {
    id: "104",
    name: "Mona Samir",
    email: "mona@gmail.com",
  },
];
export const useWorkspaceStore = create((set) => ({
  workspaces: dummyWorkspaces,
  users: dummyUsers,
  isLoading: false,
  error: null,

  createWorkspace: async (workspaceData) => {
    try {
        console.log("Creating workspace:", workspaceData);
      set({ isLoading: true, error: null });

      const data = new FormData();

      data.append("name", workspaceData.name);
      data.append("description", workspaceData.description);

      if (workspaceData.icon) {
        data.append("icon", workspaceData.icon);
      }

    //   const response = await axios.post(
    //     `${backendUrl}/api/workspaces`,
    //     data,
    //   );

      set((state) => ({
      workspaces: [
        ...state.workspaces,
        {
          ...workspaceData,
          id: Date.now().toString(),
          role: "Owner",
          members: 1,
          projects: 0,
        },
      ],
      isLoading: false,
      error: null,
    }));
        console.log("Workspace added");
    //   return response.data.workspace;
    return workspaceData; // Return the new workspace data for immediate use
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to create workspace",
        isLoading: false,
      });

      throw error;
    }
  },
  updateWorkspace: async (id, workspaceData) => {
  try {
    // const response = await axios.patch(
    //   `${backendUrl}/api/workspaces/${id}`,
    //   workspaceData
    // );

    // const updatedWorkspace = response.data.workspace;
    let updatedWorkspace;
    set((state) => ({
      workspaces: state.workspaces.map((workspace) => {
        if (workspace.id === id) {
          updatedWorkspace = {
            ...workspace,
            ...workspaceData,
          };
          return updatedWorkspace;
        }
        return workspace;
      }),
    }));
    return updatedWorkspace;
  } catch (error) {
    set({
      error:
        error.response?.data?.message ||
        "Failed to update workspace",
    });

    throw error;
  }
},
  deleteWorkspace: async (id) => {
    // await axios.delete(`${backendUrl}/api/workspaces/${id}`);
    set((state) => ({
      workspaces: state.workspaces.filter(
        (workspace) => workspace.id !== id
      ),
    }));
  },
  /////////////  Members store ////////////
inviteMember: async (workspaceId, data) => {
  set({ isLoading: true });
  try {
    // const response = await axios.post(
    //   `${backendUrl}/api/workspaces/${workspaceId}/invite`,
    //   data
    // );
    // return response.data;
      const user = dummyUsers.find(
        (user) => user.email.toLowerCase() === data.email.toLowerCase()
      );

      if (!user) {
        throw new Error("User not found");
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
       const invitation = {
          ...user,
          role: data.role,
          status: "Pending",
      };
      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === Number(workspaceId)
            ? {
                ...workspace,
                members: [...(workspace.members || []), invitation],
              }
            : workspace
        ),
      }));
      return invitation;
  } catch (error){
    console.log(error);
    throw error;
  }
   finally {
    set({ isLoading: false });
  }
},
}));

