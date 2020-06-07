import api from '../../services/api';

const createPoint = async (data: FormData) => {
    await api.post('points', data)
}

export default createPoint;