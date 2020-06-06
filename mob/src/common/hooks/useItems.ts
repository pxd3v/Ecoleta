import {useEffect, useState} from 'react';
import api from '../../services/api';

export interface Item {
    id: number;
    name: string;
    image_url: string;
}

const useItems = () => {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const load = async () => {
            const response = await api.get('items');
            setItems(response.data);
        }
        load();
    }, [])

    return items;
}

export default useItems;