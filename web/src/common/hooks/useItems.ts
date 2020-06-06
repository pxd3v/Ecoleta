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
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, [])

    return items;
}

export default useItems;