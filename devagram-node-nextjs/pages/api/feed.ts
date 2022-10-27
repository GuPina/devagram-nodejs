import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { UsuarioModel } from '../../models/UsuarioModel';
import publicacao from './publicacao';
import { SeguidorModel } from '../../models/SeguidorModel';
import { publicaçãoModel } from '../../models/publicacaoModel';

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
        }else{
            const {userId} = req.query;
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro : 'Usuario nao encontado'});
            }

            const seguidores = await SeguidorModel.find({usuarioId : usuarioLogado})
            const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId)

            const publicacoes = await publicaçãoModel.find({
                $or : [
                    {idUsuario : usuarioLogado._id},
                    {idUsuario : seguidores}
                ] 
            })
            .sort({data : -1});

            const result = [];
            for(const publicacao of publicacoes){
                const usuarioDaPublicacao = await UsuarioModel.findById(publicacao.idUsuario);
                if(usuarioDaPublicacao){
                    const final = {...publicacao._doc, usuario : {
                        nome : usuarioDaPublicacao,
                        avatar : usuarioDaPublicacao.avatar
                    }};
                    result.push(final);
                }
            }


            return res.status(200).json(publicacoes);
        }
       
       
        return res.status(405).json({erro : 'Metodo informado nao e valido'});
    }catch(e){
        console.log(e);
    }
    res.status(400).json({erro : 'Nao foi possivel obter o feed'});

}

export default validarTokenJWT(conectarMongoDB(feedEndpoint));