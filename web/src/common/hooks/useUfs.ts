import {useEffect, useState} from 'react';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
}

const useUFs = () => {
    const [ufs, setUf] = useState<string[]>([]);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            setUf(response.data.map(uf => uf.sigla));
        })
    }, [])

    return ufs;
}

export default useUFs;