const fs = require("fs");

module.exports = class Finder {
    static async find(name){
        try{
            const file  = await fs.promises.readFile(name);
            return file;
        }
        catch(err){
            console.log(err);
        }
    }
}