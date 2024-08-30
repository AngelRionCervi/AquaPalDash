import fs from 'fs';
import mkcert from 'vite-plugin-mkcert';

(async () => {
  const necessaryCerts = ['cert.pem', 'dev.pem', 'rootCA.pem'];
  const certDirContent = fs.readdirSync('./cert');

  if (necessaryCerts.some((certFile) => !certDirContent.includes(certFile))) {
    await mkcert({ savePath: './cert', force: true }).config({
      server: { host: 'localhost' }
    });
  }
})();
