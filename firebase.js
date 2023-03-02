import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgugdz9VyTTb0mhqFZ2b1SM6m0S4SAYas",
  authDomain: "guess-who-6b283.firebaseapp.com",
  projectId: "guess-who-6b283",
  storageBucket: "guess-who-6b283.appspot.com",
  messagingSenderId: "217693269240",
  appId: "1:217693269240:web:44f03894ee46be0a685f0d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getCategoriesData = async () => {
  const categoriesRef = collection(db, "Categories");
  const categoriesSnapshot = await getDocs(categoriesRef);

  const categoriesData = [];
  categoriesSnapshot.forEach((doc) => {
    const category = {
      id: doc.data().id,
      title: doc.data().title,
      cards: doc.data().cards,
    };
    categoriesData.push(category);
  });

  const sortedCategoriesData = categoriesData.sort((a, b) => a.id - b.id);

  return sortedCategoriesData;
};
