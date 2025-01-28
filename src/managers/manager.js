import fs from 'node:fs'
import __dirname from '../../utils.js'

class productManager{
    constructor(path){
        this.path = path
    }
    async getAllProds(){
        const res = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(res)
    }

    async addProd(prodCreated){
        const products = await this.getAllProds()
        products.push(prodCreated)
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return products
    }
}

export const PRD = new productManager(__dirname + '/src/products.json')