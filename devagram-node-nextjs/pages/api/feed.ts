import type {NextApiRequest, NextApiResponse} from 'next';
import {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { UsuarioModel } from '../../models/UsuarioModel';
import publicacao from './publicacao';

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any> ) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(405).json({erro : 'Metodo informado nao e valido'});
                }

                const publicacoes = await publicacao
                .find({idUsuario : usuario._id})
                .sort({data : -1});
            }   
            return res.status(200).json(publicacao);
        }
        return res.status(405).json({erro : 'Metodo informado nao e valido'});
    }catch(e){
        console.log(e);
    }
    res.status(400).json({erro : 'Nao foi possivel obter o feed'});

}

export default validarTokenJWT(conectarMongoDB(feedEndpoint));