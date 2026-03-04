const indexTemplate = () => {
  return `import Server from "./server";

const server = new Server();

server.start();
`;
}

export default indexTemplate;
