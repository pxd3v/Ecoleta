import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet';
import useItems from '../../common/hooks/useItems';
import useUfs from '../../common/hooks/useUfs';
import getActualCoords from '../../common/functions/getActualCoords'
import { LeafletMouseEvent } from 'leaflet';
import getCities from '../../common/functions/getCities';
import createPoint from '../../common/functions/createPoint';
import logo from '../../assets/logo.svg'
import Dropzone from '../../Components/Dropzone';

import './styles.css';

interface Coordinates {
    lat: number;
    lng: number;
}

interface FormData {
    name: '',
    email: '',
    whatsapp: '',
}


const CreatePoint: React.FC = () => {
    const [coordinates, setCoordinates] = useState<Coordinates>({lat: 0, lng: 0})
    const [selectedUf, setSelectedUf] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        whatsapp: '',
    });
    const [cities, setCities] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const items = useItems();
    const ufs = useUfs();
    const history = useHistory();

    useEffect(() => {
        getCities(selectedUf).then(c => setCities(c));
    }, [selectedUf])

    useEffect(() => {
        setCoordinates(getActualCoords())
    }, [])

    const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
        const uf = event.target.value;
        setSelectedUf(uf);
    }
    const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
        const city = event.target.value;
        setSelectedCity(city);
    }
    const handleMapClick = (event: LeafletMouseEvent) => {
        setCoordinates({
            lat: event.latlng.lat,
            lng: event.latlng.lng
        })
    }
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleSelectItem = (id: number) => {
        const alreadySelected = selectedItems.findIndex(i => i === id);
        if(alreadySelected > -1){
            const filteredItems = selectedItems.filter(i => i !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id]);
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const {lat, lng} = coordinates;
        const items = selectedItems;

        const data = new FormData();
            data.append('name', name);
            data.append('email', email);
            data.append('whatsapp', whatsapp);
            data.append('uf', uf);
            data.append('city', city);
            data.append('latitude', String(lat));
            data.append('longitude', String(lng));
            data.append('items', items.join(','));
            if(selectedFile){
                data.append('image', selectedFile);
            }
        await createPoint(data);
        alert('Ponto de coleta criado!');
        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <Dropzone onFileUploaded={setSelectedFile} />
                    <div className="field">
                        <label htmlFor="name">
                            Nome da entidade                            
                        </label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">
                                Email                            
                            </label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">
                                Whatsapp                           
                            </label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={{lat: -19.5131869, lng: -43.7436503}} zoom={15} onClick={handleMapClick}>
                        <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <Marker position={coordinates}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map((uf) =>
                                    <option key={uf} value={uf}>{uf}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map((c) =>
                                    <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(i => (
                            <li key={i.id} onClick={() => handleSelectItem(i.id)} className={selectedItems.includes(i.id) ? 'selected' : ''}>
                                <img src={i.image_url} alt={i.name}/>
                                <span>{i.name}</span>
                            </li>
                        ))}
                        
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>        
    )
}

export default CreatePoint;