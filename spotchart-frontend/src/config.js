function generateApiUri(config) {
  return config.hostname + ":" + config.port + config.prefix;
}

export const apiURI = generateApiUri({
  hostname: "http://localhost",
  port: 8080,
  prefix: "/api/v1"
})
