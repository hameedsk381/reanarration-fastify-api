
import { FleekSdk, PersonalAccessTokenService } from '@fleekxyz/sdk';
const patService = new PersonalAccessTokenService({
    personalAccessToken: process.env.PERSONAL_ACCESS_TOKEN,
    projectId: process.env.PROJECT_ID
  })
  
  
  const fleekSdk = new FleekSdk({ accessTokenService: patService });
const uploadFileController =  async (request, reply) => {
    const data = await request.file();
    if (!data.file) {
      return reply.code(400).send('No file uploaded.');
    }
  
    try {
      const fileData = await data.toBuffer();
      const fileName = data.filename;
      const result = await fleekSdk.ipfs().add({  // Added await here
        path: fileName,
        content: fileData
      });
      reply.send(`https://${result.cid.toString()}.ipfs.w3s.link/`);
    } catch (error) {
      console.error('Error uploading file:', error);
      reply.code(500).send('Error uploading file', error.message);
    }
  };
  export default uploadFileController;