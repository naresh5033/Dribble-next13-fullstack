import { g, config, auth } from '@grafbase/sdk';
// g is the schema generator and the config is the final final object to return.

// @ts-ignore
const User = g.model('User', {
  name: g.string().length({ min: 2, max: 100 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().length({ min: 2, max: 1000 }).optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(), 
  // the user can ve multiple projects
  projects: g.relation(() => Project).list().optional(),
}).auth((rules) => {
  rules.public().read() //the rules for the user is public (so everyone can read,)
})

// @ts-ignore
const Project = g.model('Project', {
  title: g.string().length({ min: 3 }),
  description: g.string(), 
  image: g.url(),
  liveSiteUrl: g.url(), 
  githubUrl: g.url(), 
  category: g.string().search(), //allow us to search thru the categories.
  createdBy: g.relation(() => User),
}).auth((rules) => {
  rules.public().read() //for the project only the read pro is pub and the remaining is private(as)
  rules.private().create().delete().update()
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret:  g.env('NEXTAUTH_SECRET') // this next  auth secret is used to encrypt the next js JWT and to hash email verification token
})

export default config({
  schema: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private() //means we re setting all the funcionality of our app to be privatie
  },
})

