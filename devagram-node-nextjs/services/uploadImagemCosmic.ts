import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env;

    const cosmic = cosmicjs();
    const bucketAvatares = cosmic.bucket({
        slug: BUCKET_AVATARES,
        write_key: CHAVE_GRAVACAO_AVATARES
    });

    const bucketPublicacoes = cosmic.bucket({
        slug: BUCKET_PUBLICACOES,
        write_key: CHAVE_GRAVACAO_PUBLICACOES
    });

    const sortage = multer.memoryStorage();
    const upload = multer({storage : sortage});

    const uploadImagemCosmic = async(req : any) => {
        console.log('uploadImagemCosmic', req);
        if(req?.file?.originalname){

            if(!req.file.originalname.includes(.png)&&
                !req.file.originalname.includes(.jpg)&&
                !req.file.originalname.includes(.jpeg)){
                    throw new Error ('Extensao da imagem invalida');
                }

        



            
            const media_object = {
                originalName: req.file.originalName,
                buffer : req.file.buffer
            };

            console.log('uploadImagemCosmic url', req.url);
            console.log('uploadImagemCosmic media_object', media_object);
            if(req.url && req.url.inludes('Publicação')){
                return await bucketPublicacoes.addMedia({media : media_object });
            }else{
                return await bucketAvatares.addMedia({media : media_object });
            }
        }
    }

    export {upload, uploadImagemCosmic};