import { GraphQLClient } from "graphql-request";

import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  updateProjectMutation,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserQuery,
  projectsQuery,
  projectsQueryAll,
  projectsQueryWithFilter,
} from "@/graphql";
import { ProjectForm } from "@/common.types";

// this action file is responsible for the querying(the actual query logic in the garphql dir, we just use those fns here) logics to the grafbase and sending req to  server

// condns for the prod and the dev environment (of the grafbase and our app)
const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ""
  : "http://127.0.0.1:4000/graphql";
const apiKey = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ""
  : "letmein";
const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:3000";

const client = new GraphQLClient(apiUrl);

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`); //this endpt is where the next auth automatically publishes our token by default (so we don't need to create the api/endpt)
    return response.json();
  } catch (err) {
    throw err;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        path: imagePath,
      }),
    });
    return response.json(); // contains the public url of our img on the cloudinary server
  } catch (err) {
    throw err;
  }
};

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (err) {
    throw err;
  }
};

//the end cursor - allow us to know which page are we on.
export const fetchAllProjects = (
  category?: string | null,
  endcursor?: string | null
) => {
  client.setHeader("x-api-key", apiKey);
  if (category) {
    return makeGraphQLRequest(projectsQueryWithFilter, {
      category,
      endcursor,
    });

    return makeGraphQLRequest(projectsQueryAll, { category });
  }

  //return makeGraphQLRequest(projectsQuery, { category, endcursor });
};

// querey to create a  new project
export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`); //make sure only the logged in user can upload

    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorId,
        }, // now all the data/field in the form is paired with the img url which is paired with the creator id from the session
      },
    };

    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const updateProject = async (
  form: ProjectForm,
  projectId: string,
  token: string
) => {
  // here we ve to check few things, if the user has also redeploy/udpdate the img, so it the url of the img is base 64 then its a new upload if not then its cloudinary (its old/already uploaded)
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = { ...form };

  const isUploadingNewImage = isBase64DataURL(form.image);

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image);

    // now that we got the img url add it to the updated form
    if (imageUrl.url) {
      updatedForm = { ...updatedForm, image: imageUrl.url }; //and replace the img with the cloudinary img
    }
  }

  client.setHeader("Authorization", `Bearer ${token}`);

  const variables = {
    id: projectId,
    input: updatedForm,
  };

  return makeGraphQLRequest(updateProjectMutation, variables);
};

export const deleteProject = (id: string, token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};

//export const fetchAll

export const getProjectDetails = (id: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);

  const variables = {
    input: {
      name: name,
      email: email,
      avatarUrl: avatarUrl,
    },
  };

  return makeGraphQLRequest(createUserMutation, variables);
};

export const getUserProjects = (id: string, last?: number) => {
  //last - how many of those do we wanna get
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const getUser = (email: string) => {
  // before making any requests to the db set the api key in the header
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};
