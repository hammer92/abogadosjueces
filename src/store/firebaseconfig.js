import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

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

  export {
    AffiliatesRef,
    AffiliatesEdit,
    ConfigRef
  }
