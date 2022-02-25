import { initializeApp } from "firebase/app";
import { getDatabase, ref} from "firebase/database";

import { getStorage, ref as refStorage, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC-6FopE204jTiJ7JIFw2qMDIH5qViw3zs",
    authDomain: "abogadosjueces.firebaseapp.com",
    databaseURL: "https://abogadosjueces-default-rtdb.firebaseio.com",
    projectId: "abogadosjueces",
    storageBucket: "abogadosjueces.appspot.com",
    messagingSenderId: "310826167969",
    appId: "1:310826167969:web:c59b339c61f8c6fe1d8ae0",
    measurementId: "G-NS6DZVFKHQ",
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const Affiliates = "Affiliates";
  const AffiliatesRef = ref(db, Affiliates); 
  const AffiliatesEdit = (UUID) => ref(db, `${Affiliates}/${UUID}`)
  
  const Config = "Config";
  const ConfigRef = ref(db, Config);
  const DbRef = ref(db);


const storage = getStorage();
const storageRef = (nameFile) => refStorage(storage, `contratos/${nameFile}`)


// 'file' comes from the Blob or File API

let uploadFile = ({name, file}) => new Promise((resolve, reject) => {
  uploadBytes(storageRef(name), file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    return resolve(snapshot)
  });
});

  export {
    AffiliatesRef,
    AffiliatesEdit,
    ConfigRef,
    DbRef,
    uploadFile
  }
