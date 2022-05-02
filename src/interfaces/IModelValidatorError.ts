interface IErrorPath {
  properties: {
    validator: Function
    message: string
    type: string
    path: string
  }
  kind: string
  path: string
}

export default interface IModelValidatorError {
  errors: IErrorPath[]
}
