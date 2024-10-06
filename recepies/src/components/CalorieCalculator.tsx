import Link from "next/link";
import { FC, useMemo } from "react";

// Interfaces
interface Ingredient {
  name: string;
  quantity: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  saturatedFats: number;
  cholesterol: number;
  sodium: number;
  potassium: number;
  fiber: number;
  sugar: number;
  vitaminA: number;
  vitaminC: number;
}

interface CalorieCalculatorProps {
  ingredients: Ingredient[];
  servings: number;
}

// Utility function
const roundToOneDecimal = (num: number): number => Number(num.toFixed(1));

// Subcomponents
const CalorieBox: FC<{
  title: string;
  value: number;
  icon: JSX.Element;
  bgColor?: string;
}> = ({ title, value, icon, bgColor = "bg-gray-800" }) => (
  <div className={`${bgColor} p-4 rounded-lg text-white text-center`}>
    <div className="flex justify-center mb-2">{icon}</div>
    <div className="text-sm mb-1">{title}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

const NutritionalTable: FC<{
  ingredients: Ingredient[];
  totals: Ingredient;
}> = ({ ingredients, totals }) => (
  <div className="overflow-x-auto mt-8">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-left p-2">Ingrediente</th>
          <th className="p-2">Quantità</th>
          <th className="p-2">Calorie</th>
          <th className="p-2">Proteine</th>
          <th className="p-2">Carb.</th>
          <th className="p-2">Grassi</th>
          <th className="p-2">Grassi Sat.</th>
          <th className="p-2">Colest.</th>
          <th className="p-2">Sodio</th>
          <th className="p-2">Potassio</th>
          <th className="p-2">Fibre</th>
          <th className="p-2">Zuccheri</th>
          <th className="p-2">Vit. A</th>
          <th className="p-2">Vit. C</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ingredient, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
          >
            <td className="p-2 font-medium">{ingredient.name}</td>
            <td className="p-2 text-center">{ingredient.quantity}g</td>
            <td className="p-2 text-center">{ingredient.calories}</td>
            <td className="p-2 text-center">{ingredient.proteins}g</td>
            <td className="p-2 text-center">{ingredient.carbs}g</td>
            <td className="p-2 text-center">{ingredient.fats}g</td>
            <td className="p-2 text-center">{ingredient.saturatedFats}g</td>
            <td className="p-2 text-center">{ingredient.cholesterol}mg</td>
            <td className="p-2 text-center">{ingredient.sodium}mg</td>
            <td className="p-2 text-center">{ingredient.potassium}mg</td>
            <td className="p-2 text-center">{ingredient.fiber}g</td>
            <td className="p-2 text-center">{ingredient.sugar}g</td>
            <td className="p-2 text-center">{ingredient.vitaminA}%</td>
            <td className="p-2 text-center">{ingredient.vitaminC}%</td>
          </tr>
        ))}
        <tr className="bg-gray-200 font-bold">
          <td className="p-2">Totali</td>
          <td className="p-2 text-center">{totals.quantity}g</td>
          <td className="p-2 text-center">{totals.calories}</td>
          <td className="p-2 text-center">{totals.proteins}g</td>
          <td className="p-2 text-center">{totals.carbs}g</td>
          <td className="p-2 text-center">{totals.fats}g</td>
          <td className="p-2 text-center">{totals.saturatedFats}g</td>
          <td className="p-2 text-center">{totals.cholesterol}mg</td>
          <td className="p-2 text-center">{totals.sodium}mg</td>
          <td className="p-2 text-center">{totals.potassium}mg</td>
          <td className="p-2 text-center">{totals.fiber}g</td>
          <td className="p-2 text-center">{totals.sugar}g</td>
          <td className="p-2 text-center">{totals.vitaminA}%</td>
          <td className="p-2 text-center">{totals.vitaminC}%</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Icons
const WeightIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  </svg>
);

const TotalIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const PortionIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

// Main Component
const CalorieCalculator: FC<CalorieCalculatorProps> = ({
  ingredients,
  servings,
}) => {
  const { totals, perGram, totalCalories, caloriesPerServing } = useMemo(() => {
    const totals = ingredients.reduce(
      (acc, curr) => ({
        quantity: roundToOneDecimal(acc.quantity + curr.quantity),
        calories: roundToOneDecimal(acc.calories + curr.calories),
        proteins: roundToOneDecimal(acc.proteins + curr.proteins),
        carbs: roundToOneDecimal(acc.carbs + curr.carbs),
        fats: roundToOneDecimal(acc.fats + curr.fats),
        saturatedFats: roundToOneDecimal(
          acc.saturatedFats + curr.saturatedFats
        ),
        cholesterol: roundToOneDecimal(acc.cholesterol + curr.cholesterol),
        sodium: roundToOneDecimal(acc.sodium + curr.sodium),
        potassium: roundToOneDecimal(acc.potassium + curr.potassium),
        fiber: roundToOneDecimal(acc.fiber + curr.fiber),
        sugar: roundToOneDecimal(acc.sugar + curr.sugar),
        vitaminA: roundToOneDecimal(acc.vitaminA + curr.vitaminA),
        vitaminC: roundToOneDecimal(acc.vitaminC + curr.vitaminC),
      }),
      {
        quantity: 0,
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        saturatedFats: 0,
        cholesterol: 0,
        sodium: 0,
        potassium: 0,
        fiber: 0,
        sugar: 0,
        vitaminA: 0,
        vitaminC: 0,
        name: "Total",
      } as Ingredient
    );

    const perGram = roundToOneDecimal(
      (totals.calories / totals.quantity) * 100
    );
    const totalCalories = totals.calories;
    const caloriesPerServing = roundToOneDecimal(totalCalories / servings);

    return { totals, perGram, totalCalories, caloriesPerServing };
  }, [ingredients, servings]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-2xl font-bold text-blue-500">
          La tua Ricetta
        </Link>
        <Link
          href="/try-free"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Torna al Piano Settimanale
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Calorie ({servings} porzioni)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CalorieBox title="Per 100g" value={perGram} icon={<WeightIcon />} />
        <CalorieBox
          title="Calorie Totali"
          value={totalCalories}
          icon={<TotalIcon />}
          bgColor="bg-red-500"
        />
        <CalorieBox
          title="Per Porzione"
          value={caloriesPerServing}
          icon={<PortionIcon />}
        />
      </div>

      <Link
        href="#"
        className="text-blue-500 hover:underline text-sm block mb-6"
      >
        Leggi maggiori informazioni
      </Link>

      <NutritionalTable ingredients={ingredients} totals={totals} />
    </div>
  );
};

export default CalorieCalculator;
