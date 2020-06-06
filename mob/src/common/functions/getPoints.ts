import api from '../../services/api';

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

const getPoints = async (filters: Filters) => {

            const response = await api.get('points', {
                params: {
                    city: filters.city,
                    uf: filters.uf,
                    items: filters.items
                }
            })
    return response.data;
}

export default getPoints;