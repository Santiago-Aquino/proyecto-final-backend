import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.id = 0;
    };

    addProducts = async (title, description, code, price, status, stock, category, thumbnail) => {
        try {
            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) return false;
            else {
                this.id++;
                const product = {
                    'id': this.id,
                    'title': title,
                    'description': description,
                    'code': code,
                    'price': price,
                    'status': status,
                    'stock': stock,
                    'category': category,
                    'thumbnail': thumbnail
                };
                this.products.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
                return true;
            };
        }
        catch (error) {
            throw new Error(error);
        };
    };

    getProducts = async () => {
        try {
            let string = await fs.promises.readFile(this.path, 'utf-8');
            const object = JSON.parse(string);
            return object;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    getProductById = async (paramId) => {
        try {
            let string = await fs.promises.readFile(this.path, 'utf-8');
            const object = JSON.parse(string);
            const resultFind = object.find(el => el.id == paramId);
            return resultFind;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    updateProduct = async (paramId, obj) => {
        try {
            const object = await this.getProducts();
            const resultFind = object.find(el => el.id == paramId);
            if (resultFind === undefined) return false;
            else {
                resultFind.title = obj.title || resultFind.title;
                resultFind.description = obj.description || resultFind.description;
                resultFind.price = obj.price || resultFind.price;
                resultFind.thumbnail = obj.thumbnail || resultFind.thumbnail;
                resultFind.code = obj.code || resultFind.code;
                resultFind.stock = obj.stock || resultFind.stock;
                await fs.promises.writeFile(this.path, JSON.stringify(object, null, '\t'));
                return true;
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }

    deleteProduct = async (paramId) => {
        try {
            const result = await this.getProductById(paramId);
            const object = await this.getProducts();
            if (result === undefined) return false;
            else {
                const products = object.filter(el => el.id != paramId);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                return true;
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
};