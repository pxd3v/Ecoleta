import api from '../../services/api';
import react, { useState, useEffect } from 'react';

export interface ColectPoint {
    id: number;
    name: string;
    image: string;
    latitude: number;
    longitude: number;
}

interface Filters {
    city: string;
    uf: string;
    items: number[];
}

const usePoints = (filters: Filters) => {
    const [points, setPoints ] = useState<ColectPoint[]>([]);

    useEffect(()=> {
        const load = async () => {
            const response = await api.get('points', {
                params: {
                    city: filters.city,
                    uf: filters.uf,
                    items: filters.items
                }
            })
            setPoints(response.data);
        } 
        load();
    }, [filters]);
    return points;
}

export default usePoints;