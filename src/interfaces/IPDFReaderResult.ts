export default interface IPDFReaderResult {
    error: boolean
    message?: string
    code?: number
    data: string[]
}