import { PdfReader } from 'pdfreader'

export function parse(buffer: Buffer) {
    return new Promise(resolve => {
        const data: string[] = []

        new PdfReader().parseBuffer(buffer, (err: unknown, item: { text: string }) => {
            if (err) return resolve({ error: true, message: 'Unable to read this PDF', code: 500, data })
            if (!item) return resolve({ error: true, message: 'Empty PDF', code: 400, data })

            if (data.length < 10) return data.push(item.text)
            if (data.length === 10) return resolve({ error: false, data })
        })
    })
}