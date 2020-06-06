import axios from 'axios';

interface IBGECityResponse {
    nome: string;
}

const getCities = async (uf: string) => {
    if(uf === '0'){
        return [];
    }
    
    const cities = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    return cities.data.map(c => c.nome)
}

export default getCities;