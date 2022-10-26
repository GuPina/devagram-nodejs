import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { publicaçãoModel } from '../../models/publicacaoModel';
import { UsuarioModel } from '../../models/UsuarioModel';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';

const likeEndpoint 
    = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

    try{

        if(req.method === 'PUT'){

            const {id} = req?.query;
            const publicacao = await publicaçãoModel.findById(id);
            if(!publicacao)
                res.status(400).json({erro : 'Publicação não encontrada'}){

                }
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuario não encontrada'})
            }

            const indexDoUsuarioNoLike = usuarioJaCurtiuEssaPublicacao = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());
            
            if(indexDoUsuarioNoLike != -1){
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await publicaçãoModel.findByIdAndUpdate({id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicação descurtida com sucesso'});
            }else {
                publicacao.likes.push(usuario._id);
                await publicaçãoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicação curtida com sucesso'});
            }


        }

        return res.status(405).json({erro : 'Metodo informado nao e valido'});



    }catch(e){
        console. log(e);
        return res.status(500).json({erro : 'Ocorreu erro ao curtir/descurtir publicação'});

    }
}

export default validarTokenJWT(conectarMongoDB(likeEndpoint));

