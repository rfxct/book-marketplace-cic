export function isValid (value?: string) {
    if (!value) return false
    const [columns, ...rows] = value.split(/\n|\n\r/).map(row => row.split(','))
    return rows.every(row => row.length === columns.length)
}

export function parse (value?: string) {
    if (!value) return []

    const [columns, ...rows] = value.split(/\n|\n\r/).map(row => row.split(','))
    
    const result = []
    for (const row of rows) {
        const entries = columns.map((name, i) => [name, row[i].trim()])

        result.push(Object.fromEntries(entries))
    }

    return result
}