import path from "path"
import { generateApi } from "swagger-typescript-api"

const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

const toCamelCaseObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCaseObject(item))
  }

  if (obj === null || typeof obj !== "object") {
    return obj
  }

  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const newKey = toCamelCase(key)
    result[newKey] = toCamelCaseObject(value)
  }
  return result
}

function mapEntries(obj, mapCallbackFn) {
  return Object.fromEntries(Object.entries(obj).map(mapCallbackFn))
}

function onCreateComponent(component) {
  if (!component.rawTypeData) {
    return component
  }

  if (component.rawTypeData.properties) {
    component.rawTypeData.properties = mapEntries(
      component.rawTypeData.properties,
      ([propName, value]) => {
        return [toCamelCase(propName), value]
      }
    )
  }
  if (
    component.rawTypeData.required &&
    Array.isArray(component.rawTypeData.required)
  ) {
    component.rawTypeData.required = component.rawTypeData.required.map(
      (propName) => toCamelCase(propName)
    )
  }
  return component
}

const BACKEND_URL = process.env.BACKEND_URL

generateApi({
  defaultResponseAsSuccess: false,
  extractRequestBody: true,
  extractRequestParams: true,
  extractResponseBody: true,
  generateClient: true,
  hooks: {
    onCreateComponent(component) {
      return onCreateComponent(component)
    },
    onPrepareConfig(currentConfiguration) {
      return {
        ...currentConfiguration,
        apiConfig: {
          ...currentConfiguration.apiConfig,
          baseUrl: BACKEND_URL,
        },
      }
    },
  },
  modular: false, // split by tags
  output: path.resolve(process.cwd(), "src/api/sdk"), // output dir
  singleHttpClient: false,
  sortRoutes: true,
  sortTypes: true,
  url: `${BACKEND_URL}/openapi.json`,
})
  .then(() => console.log("API types generated"))
  .catch((e) => console.error(e))
