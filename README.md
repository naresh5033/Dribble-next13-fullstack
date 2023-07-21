# Dribble clone

- this is a Next.js full stack application with typescript, the grafbase and tailwind css.
- fully responsible app with the JWT and next auth for the authentication.
- ```npx create-next-app@latest ./``` 
- the functionality of this app is just like the dribble where the developers can be able to upload their projects to the websites so others can go through it.
- this project can also be used as a portfolio for sharing to others to show their projects.


# grafbase 

- for the database, its a severless grapql platform, that enables us to ship high performance applications faster
  - it includes graphql api, 
  - it offers connectors, that stich garphql api or openAPI api into a unified data layer.
  - it also offers edge resolvers, and edge caching to customize the graphql api with the edge functions.
  - and we can also utilize their serverless database with full text search built in.
  - and cli for the local development with the zero configuration.
  - and git base workflow that allow us to preview environment for every branch 
  - and Auth, so we can integrate our provider using openID connect or the JWT.

- to initialize the new grafbase project ```npx init --config-format typescript``` this will create the grafbase config file
- in there we can create a schema for the user model
- then import our git repo to the grafbase(create project), it will generate the api endpoint and the api key.
- as soon as we connect our repository to the grafbase, we can query our objs/model with all the generated CRUD operation (graph ql) for us.
- to spin up the local grafbase server ```npx grafbase@0.24 dev``` http://localhost:4000/graphql`
- in the path finder we can see all our objs(in the schema) we can select em and create the query and copy and use in the actions (for the CRUD operations)
- Note : as per the next 13 doc, any client side functionality such as onClick() we need to convert this into a client comp and then use it in the server side comp (such as NavBar)

# Share work page

- this is gon be a special page in next js, we can create inside the app/create-project/page.tsx/ -> because nextjs is doing a file page routing called create-project
- it doesn't really need any routing.
# dependencies 

- ```npm i @headlessui/react``` for the combo box and the drop down elems
- ```npm i cloudinary ``` for the image upload
- ```npm i jsonwebtoken @types/jsonwebtoken graphql-request next-auth``` for the auth and the graphql req/.
- to create a next auth secret the recommended way is to use the ```openssl rand -base64 32``` we can grab and use this secret.
- for the next auth to fetch the providers, we ve to initialize the new route handler by configuring the "/app/api/auth/[...next-auth]/route.ts/" file
- and the tokens (or the bearer to send with the req header) in order to access the db, the next auth exposes the REST endpoint/API ie used by nextauth js client, and the default endpoint is "api/auth/token" , we dont ve to create this, not fully still we ve to create some endpts 
- ```npm i @grafbase/sdk --save dev``` this sdk will speed up our workflow with the grafbase..

# Deployment 

- the app has been deployed in the vercel
- and then ve to change add/update the deployed url in the google cloud console (as the authorized url with api/auth/callback/google at the end of the url)
- update our next Auth url in the env variable and then redeploy the app
- and also add the env vars for our grafbase
- 