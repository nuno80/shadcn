import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  PieChartIcon,
  ZapIcon,
  BeakerIcon,
  FlameIcon,
  ClockIcon,
  UsersIcon,
  StarIcon
} from 'lucide-react';

interface RecipeData {
  Titolo: string;
  Dosi_per: number;
  Ingredienti_JSON: string;
  Difficolta: string;
  Tempo_preparazione_totale: number;
}

interface NutritionalValues {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

interface Ingredients {
  [key: string]: number | string;
}

interface Props {
  recipe: RecipeData;
}

interface NutritionRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}

const NutritionRow: React.FC<NutritionRowProps> = ({ icon, label, value, unit }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100">
    <div className="flex items-center">
      {icon}
      <span className="ml-2 text-gray-700">{label}</span>
    </div>
    <span className="font-medium">
      {value} {unit}
    </span>
  </div>
);

const NutritionalCalculator: React.FC<Props> = ({ recipe }) => {
  const [nutritionalValues, setNutritionalValues] = useState<NutritionalValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateNutrition = async () => {
      try {
        let ingredients: Ingredients;
        try {
          ingredients = JSON.parse(recipe.Ingredienti_JSON);
          ingredients = Object.fromEntries(
            Object.entries(ingredients).filter(([_, value]) => 
              value !== 'q.b' && typeof value === 'number'
            )
          );
        } catch (e) {
          throw new Error('Errore nel parsing degli ingredienti');
        }

        const total: NutritionalValues = {
          calories: 0,
          proteins: 0,
          carbs: 0,
          fats: 0
        };

        for (const [ingredient, amount] of Object.entries(ingredients)) {
          if (typeof amount === 'number') {
            const q = query(
              collection(db, 'alimenti'), 
              where('Nome', '==', ingredient.toLowerCase())
            );
            const snapshot = await getDocs(q);
            
            if (!snapshot.empty) {
              const nutritionData = snapshot.docs[0].data();
              total.calories += (nutritionData['Energia, calorie (kcal)'] || 0) * amount / 100;
              total.proteins += (nutritionData['Proteine (g)'] || 0) * amount / 100;
              total.carbs += (nutritionData['Glucidi, disponibili (g)'] || 0) * amount / 100;
              total.fats += (nutritionData['Lipidi, totali (g)'] || 0) * amount / 100;
            }
          }
        }

        setNutritionalValues(total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore nel calcolo dei valori nutrizionali');
      } finally {
        setIsLoading(false);
      }
    };

    calculateNutrition();
  }, [recipe]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!nutritionalValues) return null;

  const perServing = {
    calories: nutritionalValues.calories / recipe.Dosi_per,
    proteins: nutritionalValues.proteins / recipe.Dosi_per,
    carbs: nutritionalValues.carbs / recipe.Dosi_per,
    fats: nutritionalValues.fats / recipe.Dosi_per,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{recipe.Titolo}</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span>{recipe.Tempo_preparazione_totale} min</span>
        </div>
        <div className="flex items-center">
          <UsersIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span>{recipe.Dosi_per} porzioni</span>
        </div>
        <div className="flex items-center">
          <StarIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span>{recipe.Difficolta}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Per ricetta</h3>
          <NutritionRow 
            icon={<FlameIcon className="h-5 w-5 text-orange-500" />}
            label="Calorie"
            value={nutritionalValues.calories.toFixed(0)}
            unit="kcal"
          />
          <NutritionRow 
            icon={<ZapIcon className="h-5 w-5 text-yellow-500" />}
            label="Proteine"
            value={nutritionalValues.proteins.toFixed(1)}
            unit="g"
          />
          <NutritionRow 
            icon={<PieChartIcon className="h-5 w-5 text-blue-500" />}
            label="Carboidrati"
            value={nutritionalValues.carbs.toFixed(1)}
            unit="g"
          />
          <NutritionRow 
            icon={<BeakerIcon className="h-5 w-5 text-green-500" />}
            label="Grassi"
            value={nutritionalValues.fats.toFixed(1)}
            unit="g"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Per porzione</h3>
          <NutritionRow 
            icon={<FlameIcon className="h-5 w-5 text-orange-500" />}
            label="Calorie"
            value={perServing.calories.toFixed(0)}
            unit="kcal"
          />
          <NutritionRow 
            icon={<ZapIcon className="h-5 w-5 text-yellow-500" />}
            label="Proteine"
            value={perServing.proteins.toFixed(1)}
            unit="g"
          />
          <NutritionRow 
            icon={<PieChartIcon className="h-5 w-5 text-blue-500" />}
            label="Carboidrati"
            value={perServing.carbs.toFixed(1)}
            unit="g"
          />
          <NutritionRow 
            icon={<BeakerIcon className="h-5 w-5 text-green-500" />}
            label="Grassi"
            value={perServing.fats.toFixed(1)}
            unit="g"
          />
        </div>
      </div>
    </div>
  );
};

export default NutritionalCalculator;