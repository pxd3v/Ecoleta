import api from '../../services/api';

interface ColectPoint {
    name: string,
    whatsapp: string,
    latitude: number,
    longitude: number,
    items: number[],
    city: string,
    uf: string,
    email: string
}
const createPoint = async (data: ColectPoint) => {
    await api.post('points', data)
}

export default createPoint;