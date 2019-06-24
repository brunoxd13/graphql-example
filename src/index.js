const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tuturial for GraphQL"
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links();
    },
    link: (root, { id }) => links.find(link => link.id === id)
  },

  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
  },

  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      });
    },

    updateLink: (parent, args) => {
      let updatedLink;

      links = links.map(link => {
        if (link.id === args.id) {
          updatedLink = { ...link, ...args };
          return updatedLink;
        }
        return link;
      });

      return updatedLink;
    },

    deleteLink: (parent, args) => {
      const removeIndex = links.findIndex(item => item.id === args.id);
      const removedLink = links[removeIndex];
      links.splice(removeIndex, 1);

      return removedLink;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: { prisma }
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
