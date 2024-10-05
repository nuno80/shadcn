// File: src/components/NutritionalCalculator.tsx

import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

interface RecipeInfo {
  Titolo: string;
  Dosi_per: number;
  Calorie_per_porzione: number;
  Ingredienti_JSON: string;
  URL: string;
}

interface NutritionalValues {
  'Energia, calorie (kcal)': number;
  'Proteine (g)': number;
  'Glucidi, disponibili (g)': number;
  'Lipidi, totali (g)': number;
  'Fibra alimentare (g)': number;
  'Sodio (Na) (mg)': number;
  [key: string]: number;
}

interface NutritionalCalculatorProps {
  recipeId: string;
}

const NutritionalCalculator: React.FC<NutritionalCalculatorProps> = ({ recipeId }) => {
  const [nutritionalValues, setNutritionalValues] = useState<NutritionalValues | null>(null);
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateNutrition = async () => {
      try {
        // Blocco 1: Recupero della ricetta dal database
        const recipeDoc = await getDoc(doc(db, 'recipes', recipeId));
        if (!recipeDoc.exists()) {
          throw new Error('Ricetta non trovata');
        }
        const recipeData = recipeDoc.data() as RecipeInfo;
        setRecipeInfo(recipeData);

        // Blocco 2: Parsing degli ingredienti JSON
        let ingredients: Record<string, number>;
        try {
          ingredients = JSON.parse(recipeData.Ingredienti_JSON);
        } catch (e) {
          console.error('Errore nel parsing degli ingredienti JSON:', e);
          ingredients = {};
        }

        // Blocco 3: Recupero dei valori nutrizionali per ogni ingrediente
        const nutritionPromises = Object.entries(ingredients).map(async ([ingredient, amount]) => {
          const ingredientQuery = query(collection(db, 'alimenti'), where('Nome', '==', ingredient));
          const ingredientSnapshot = await getDocs(ingredientQuery);
          
          if (ingredientSnapshot.empty) {
            console.warn(`Ingrediente non trovato: ${ingredient}`);
            return null;
          }

          const ingredientData = ingredientSnapshot.docs[0].data();
          return { ingredient, amount, nutrition: ingredientData };
        });

        const ingredientsWithNutrition = await Promise.all(nutritionPromises);

        // Blocco 4: Calcolo dei valori nutrizionali totali
        const totalNutrition = ingredientsWithNutrition.reduce((acc, curr) => {
          if (!curr) return acc;
          const { amount, nutrition } = curr;
          
          Object.keys(nutrition).forEach(key => {
            if (typeof nutrition[key] === 'number') {
              acc[key] = (acc[key] || 0) + (nutrition[key] * amount / 100);
            }
          });

          return acc;
        }, {} as NutritionalValues);

        setNutritionalValues(totalNutrition);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Si è verificato un errore');
      } finally {
        setLoading(false);
      }
    };

    calculateNutrition();
  }, [recipeId]);

  if (loading) return <p className="text-center text-gray-600">Caricamento in corso...</p>;
  if (error) return <p className="text-center text-red-600">Errore: {error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">{recipeInfo?.Titolo}</h2>
      <p className="text-gray-600 mb-2">Porzioni: {recipeInfo?.Dosi_per}</p>
      <p className="text-gray-600 mb-4">Calorie per porzione: {recipeInfo?.Calorie_per_porzione} kcal</p>
      
      <h3 className="text-xl font-semibold mb-3">Valori Nutrizionali Calcolati (per ricetta intera)</h3>
      {nutritionalValues && (
        <ul className="space-y-2">
          <li>Energia: {nutritionalValues['Energia, calorie (kcal)']?.toFixed(2)} kcal</li>
          <li>Proteine: {nutritionalValues['Proteine (g)']?.toFixed(2)} g</li>
          <li>Carboidrati: {nutritionalValues['Glucidi, disponibili (g)']?.toFixed(2)} g</li>
          <li>Grassi: {nutritionalValues['Lipidi, totali (g)']?.toFixed(2)} g</li>
          <li>Fibre: {nutritionalValues['Fibra alimentare (g)']?.toFixed(2)} g</li>
          <li>Sodio: {nutritionalValues['Sodio (Na) (mg)']?.toFixed(2)} mg</li>
        </ul>
      )}
      
      {recipeInfo?.URL && (
        <Link 
          href={recipeInfo.URL} 
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          target="_blank" 
          rel="noopener noreferrer"
        >
          Vai alla ricetta completa
        </Link>
      )}
    </div>
  );
};

export default NutritionalCalculator;