# Dribble clone

- this is a Next.js full stack application with typescript, the grafbase and tailwind css.
- fully responsible app with the JWT and next auth for the authentication.
- ```npx create-next-app@latest ./``` 
- the functionality of this app is just like the dribble where the developers can be able to upload their projects to the websites so others can go through it.
- 


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

# dependencies 

- ```npm i @headlessui/react``` for the combo box and the drop down elems
- ```npm i cloudinary ``` for the image upload
- ```npm i jsonwebtoken @types/jsonwebtoken graphql-request next-auth``` for the auth and the graphql req/.
- ```npm i @grafbase/sdk --save dev``` this sdk will speed up our workflow with the grafbase..
- 