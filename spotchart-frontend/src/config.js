function generateApiUri(config) {
  return config.prefix;
}

export const apiURI = generateApiUri({
  prefix: "/api/v1"
})
