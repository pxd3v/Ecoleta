import {Request, Response} from 'express';
import knex from '../database/connection'

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');
        const serializedItems = items.map(i => ({
            id: i.id,
            name: i.title,
            image_url: `http://192.168.0.126:3333/uploads/${i.image}`
        }))
        return response.json(serializedItems);
}

}

export default ItemsController;