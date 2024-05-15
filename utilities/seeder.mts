import {readFileSync} from 'fs'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import {Property} from '@/utilities/interfaces'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
connectToMongoDB()
const deleteData: Function = async (): Promise<void> => {
    try {
        await propertyModel.deleteMany()
        console.log('Data successfully deleted.')
        process.exit()
    } catch (error) {
        console.error(`Error deleting data:\n${error}`)
        process.exit(1)
    }
}
const seedData: Function = async (): Promise <void> => {
    try {
        await propertyModel.insertMany(JSON.parse(
            readFileSync(`${dirname(fileURLToPath(
                import.meta.url
            ))}/../sampleData/properties.json`, 'utf-8')
        ).map(
            (property: Property) => {return {...property}}
        ))
        console.log('Data successfully seeded.')
        process.exit()
    } catch (error) {
        console.error(`Error seeding data:\n${error}`)
        process.exit(1)
    }
}
if (process.argv[2] === '-s') {
    seedData()
} else if (process.argv[2] === '-d') {
    deleteData()
}