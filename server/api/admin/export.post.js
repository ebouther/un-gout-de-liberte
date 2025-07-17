export default defineEventHandler(async (event) => {
    try {
        // Rediriger vers le script d'export existant
        const { execSync } = await import('child_process')
        const path = await import('path')

        // Exécuter le script d'export
        const scriptPath = path.resolve('./scripts/export-stripe-data.js')
        const output = execSync(`node ${scriptPath}`, {
            encoding: 'utf-8',
            cwd: process.cwd()
        })

        // Trouver le nom du fichier généré dans la sortie
        const fileMatch = output.match(/Fichier sauvegardé : (.+\.csv)/)
        if (!fileMatch) {
            throw new Error('Impossible de trouver le fichier généré')
        }

        const filePath = fileMatch[1]
        const fs = await import('fs')

        // Lire le fichier CSV
        const csvContent = fs.readFileSync(filePath, 'utf-8')

        // Retourner le CSV en tant que réponse de téléchargement
        setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
        setHeader(event, 'Content-Disposition', 'attachment; filename="export-produits.csv"')

        return csvContent

    } catch (error) {
        console.error('Erreur lors de l\'export:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de l\'export des données'
        })
    }
})
