import React, { useState, useEffect } from 'react';
import { db } from '@/config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import fuzzysort from 'fuzzysort';

// Definizione delle interfacce
interface Ingredient {
  name: string;
  quantity: number;
  matchedAlimento: string | null;
  nutritionalData: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
}

interface Alimento {
  Nome: string;
  Sinonimi?: string;
  'Energia, kcal': string;
  'Proteine (g)': string;
  'Carboidrati, disponibili (g)': string;
  'Lipidi, totali (g)': string;
}

interface CalorieCalculatorProps {
  Ingredienti_JSON: string;
  Dosi_per: number;
  onIngredientMatch: (matches: {ingredient: string, alimento: string | null}[]) => void;
}

// Funzioni di utilità
const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};

const parseEggs = (ingredient: string, quantity: unknown): { name: string; quantity: number } | null => {
  const normalizedIngredient = normalizeString(ingredient);
  let parsedQuantity: number = 0;

  if (typeof quantity === 'number') {
    parsedQuantity = quantity;
  } else if (typeof quantity === 'string') {
    parsedQuantity = parseFloat(quantity) || 0;
  }
  
  // Caso 1: uova fresche
  if (normalizedIngredient.includes('uova fresche') || normalizedIngredient.includes('uovo fresco')) {
    return {
      name: "Uovo di gallina, intero, crudo",
      quantity: parsedQuantity
    };
  }

  // Caso 2: tuorli
  if (normalizedIngredient.includes('tuorli') || normalizedIngredient.includes('tuorlo')) {
    return {
      name: "Uovo di gallina, tuorlo, crudo",
      quantity: parsedQuantity
    };
  }

  // Caso 3 e 4: albume o bianco
  if (normalizedIngredient.includes('albume') || normalizedIngredient.includes('bianco')) {
    return {
      name: "Uovo di gallina, albume, crudo",
      quantity: parsedQuantity
    };
  }

  // Caso originale: uova (numero)
  const eggRegex = /uova?\s*\(?(\d+)(?:\s*mezz[oe]|medi[oe])?\)?/i;
  const match = normalizedIngredient.match(eggRegex);

  if (match) {
    const count = parseInt(match[1], 10);
    return {
      name: "Uovo di gallina, intero, crudo",
      quantity: count * 50 // 50g per uovo medio
    };
  }

  return null;
};

const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({
  Ingredienti_JSON,
  Dosi_per,
  onIngredientMatch
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
  });
  const [unmatchedIngredients, setUnmatchedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const fetchAlimentiData = async () => {
      try {
        const alimentiSnapshot = await getDocs(collection(db, 'alimenti'));
        const alimentiData = alimentiSnapshot.docs.map(doc => doc.data() as Alimento);

        const parsedIngredients = JSON.parse(Ingredienti_JSON);
        const ingredientPromises = Object.entries(parsedIngredients)
          .filter(([_, quantity]) => quantity !== 'q.b.')
          .map(async ([name, quantity]) => {
            const eggParsed = parseEggs(name, quantity);
            if (eggParsed) {
              const matchedAlimento = await findBestMatch(eggParsed.name, alimentiData);
              onIngredientMatch([{ ingredient: name, alimento: matchedAlimento ? matchedAlimento.Nome : null }]);
              return {
                name: eggParsed.name,
                quantity: eggParsed.quantity,
                matchedAlimento: matchedAlimento ? matchedAlimento.Nome : null,
                nutritionalData: matchedAlimento ? {
                  calories: parseFloat(matchedAlimento['Energia, kcal'] || '0'),
                  proteins: parseFloat(matchedAlimento['Proteine (g)'] || '0'),
                  carbs: parseFloat(matchedAlimento['Carboidrati, disponibili (g)'] || '0'),
                  fats: parseFloat(matchedAlimento['Lipidi, totali (g)'] || '0'),
                } : { calories: 0, proteins: 0, carbs: 0, fats: 0 },
              };
            }

            const normalizedName = normalizeString(name);
            const matchedAlimento = await findBestMatch(normalizedName, alimentiData);
            
            onIngredientMatch([{ ingredient: name, alimento: matchedAlimento ? matchedAlimento.Nome : null }]);

            return {
              name,
              quantity: typeof quantity === 'number' ? quantity : parseFloat(quantity) || 0,
              matchedAlimento: matchedAlimento ? matchedAlimento.Nome : null,
              nutritionalData: matchedAlimento ? {
                calories: parseFloat(matchedAlimento['Energia, kcal'] || '0'),
                proteins: parseFloat(matchedAlimento['Proteine (g)'] || '0'),
                carbs: parseFloat(matchedAlimento['Carboidrati, disponibili (g)'] || '0'),
                fats: parseFloat(matchedAlimento['Lipidi, totali (g)'] || '0'),
              } : { calories: 0, proteins: 0, carbs: 0, fats: 0 },
            };
          });

        const resolvedIngredients = await Promise.all(ingredientPromises);
        
        const unmatched = resolvedIngredients
          .filter(ing => !ing.matchedAlimento)
          .map(ing => ing.name);
        setUnmatchedIngredients(unmatched);
        
        setIngredients(resolvedIngredients);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
      }
    };

    fetchAlimentiData();
  }, [Ingredienti_JSON, onIngredientMatch]);

  useEffect(() => {
    const calculatedNutrition = ingredients.reduce((acc, ingredient) => {
      const factor = ingredient.quantity / 100;
      return {
        calories: acc.calories + ingredient.nutritionalData.calories * factor,
        proteins: acc.proteins + ingredient.nutritionalData.proteins * factor,
        carbs: acc.carbs + ingredient.nutritionalData.carbs * factor,
        fats: acc.fats + ingredient.nutritionalData.fats * factor,
      };
    }, { calories: 0, proteins: 0, carbs: 0, fats: 0 });

    setTotalNutrition(calculatedNutrition);
  }, [ingredients]);

  const findBestMatch = async (ingredientName: string, alimentiData: Alimento[]): Promise<Alimento | null> => {
    // Gestione speciale per le uova e le loro parti
    const eggParts = [
      "Uovo di gallina, intero, crudo",
      "Uovo di gallina, tuorlo, crudo",
      "Uovo di gallina, albume, crudo"
    ];
    if (eggParts.includes(ingredientName)) {
      const exactMatch = alimentiData.find(alimento => alimento.Nome === ingredientName);
      if (exactMatch) return exactMatch;
    }

    const results = alimentiData.map(alimento => {
      const nameMatch = fuzzysort.single(ingredientName, alimento.Nome);
      const synonymMatches = alimento.Sinonimi
        ? alimento.Sinonimi.split(',').map(synonym => fuzzysort.single(ingredientName, normalizeString(synonym)))
        : [];
      
      const bestSynonymMatch = synonymMatches.reduce((best, current) => 
        current && (!best || current.score > best.score) ? current : best, null);
      
      return {
        alimento,
        score: Math.max(nameMatch ? nameMatch.score : -Infinity, bestSynonymMatch ? bestSynonymMatch.score : -Infinity)
      };
    });

    results.sort((a, b) => b.score - a.score);
    return results.length > 0 && results[0].score > -10000 ? results[0].alimento : null;
  };

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Valori Nutrizionali</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Calorie totali:</p>
          <p>{Math.round(totalNutrition.calories)} kcal</p>
        </div>
        <div>
          <p className="font-semibold">Calorie per porzione:</p>
          <p>{Math.round(totalNutrition.calories / Dosi_per)} kcal</p>
        </div>
        <div>
          <p className="font-semibold">Proteine:</p>
          <p>{totalNutrition.proteins.toFixed(1)} g</p>
        </div>
        <div>
          <p className="font-semibold">Carboidrati:</p>
          <p>{totalNutrition.carbs.toFixed(1)} g</p>
        </div>
        <div>
          <p className="font-semibold">Grassi:</p>
          <p>{totalNutrition.fats.toFixed(1)} g</p>
        </div>
      </div>
      
      {unmatchedIngredients.length > 0 && (
        <div className="mt-4">
          <p className="text-yellow-600 font-semibold">
            Ingredienti non trovati nel database:
          </p>
          <ul className="list-disc list-inside">
            {unmatchedIngredients.map((ing, index) => (
              <li key={index}>{ing}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalorieCalculator;