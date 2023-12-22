const fs = require( 'fs')
const util = require( 'util')

const asyncWriteFile = util.promisify(fs.writeFile)

const filterWriter = async (data, desitination) => {
    try {
        if(!data || !desitination)
            return "Must provide data and destination"
        const done = await asyncWriteFile(desitination, data, "utf-8");
        if(done) {
            console.log("File written successfully...")
        }
        return
    } catch (error) {
        console.log("Error occured while writing file...", error)
    }

}

module.exports = filterWriter