import api from '../../services/api';
import react, { useState, useEffect } from 'react';

interface ColectPointData {
    serializedPoint: {
        image: string;
        image_url: string;
        name: string;
        email: string;
        whatsapp: string;
        city: string;
        uf: string
    },
    items: {
        title: string;
    }[]
}

const usePointData = (id: number) => {
    const [pointData, setPointData ] = useState<ColectPointData | null>(null);

    useEffect(()=> {
        const load = async () => {
            const response = await api.get(`points/${id}`)
            setPointData(response?.data);
        } 
        load();
    }, [id]);
    return pointData;
}

export default usePointData;