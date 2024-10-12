// RicettaPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CalorieCalculator from '@/components/CalorieCalculator';

// Blocco 1: Definizione delle interfacce
// ======================================

interface Ricetta {
  Titolo: string;
  Immagine_URL: string;
  Tempo_preparazione_totale: number;
  Presentazione: string;
  Tipologia_dieta: string;
  ID: string;
  Difficolta: string;
  Calorie_per_porzione: number;
  Costo: string;
  Cottura: string;
  Dosi_per: number;
  Ingredienti: string;
  Ingredienti_JSON: string | null;
  Istruzioni: string;
  Preparazione: string;
  Calorie_calcolate: number;
  Tipologia_piatti: string;
  URL: string;
}

interface IngredientMatch {
  ingredient: string;
  alimento: string | null;
}

// Blocco 2: Componente principale RicettaPage
// ===========================================

export default function RicettaPage() {
  // Blocco 2.1: Dichiarazione degli stati
  // -------------------------------------
  const { id } = useParams();
  const [ricetta, setRicetta] = useState<Ricetta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ingredientMatches, setIngredientMatches] = useState<IngredientMatch[]>([]);

  // Blocco 2.2: Effetto per il caricamento della ricetta
  // ----------------------------------------------------
  useEffect(() => {
    const getRicetta = async () => {
      try {
        if (!id) throw new Error('ID ricetta non fornito');
        
        const docRef = doc(db, 'ricette', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRicetta(docSnap.data() as Ricetta);
        } else {
          setError('Ricetta non trovata');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    getRicetta();
  }, [id]);

  // Blocco 2.3: Funzione per gestire le corrispondenze degli ingredienti
  // -------------------------------------------------------------------
  const handleIngredientMatch = (matches: IngredientMatch[]) => {
    setIngredientMatches(prevMatches => {
      // Aggiungi solo le nuove corrispondenze
      const newMatches = matches.filter(match => 
        !prevMatches.some(prevMatch => prevMatch.ingredient === match.ingredient)
      );
      return [...prevMatches, ...newMatches];
    });
  };

  // Blocco 2.4: Rendering condizionale per caricamento ed errori
  // ------------------------------------------------------------
  if (loading) {
    return <div className="text-center py-8">Caricamento in corso...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Errore: {error}</div>;
  }

  // Blocco 2.5: Rendering principale del componente
  // -----------------------------------------------
  return (
    <div className="container mx-auto py-12">
      <Card className="shadow-lg p-6 rounded-lg">
        {/* Blocco 2.5.1: Header della Card */}
        <CardHeader className="flex flex-col items-center mb-6">
          <Avatar className="w-36 h-36 mb-4">
            <AvatarImage src={ricetta?.Immagine_URL} alt={ricetta?.Titolo} />
            <AvatarFallback>{ricetta?.Titolo.slice(0, 2) || 'RC'}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{ricetta?.Titolo}</CardTitle>
        </CardHeader>

        {/* Blocco 2.5.2: Contenuto principale */}
        <CardContent className="text-lg">
          {/* Dettagli della ricetta */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p><span className="font-semibold">Tempo di preparazione:</span> {ricetta?.Tempo_preparazione_totale} minuti</p>
            <p><span className="font-semibold">Cottura:</span> {ricetta?.Cottura}</p>
            <p><span className="font-semibold">Preparazione:</span> {ricetta?.Preparazione}</p>
            <p><span className="font-semibold">Difficoltà:</span> {ricetta?.Difficolta}</p>
            <p><span className="font-semibold">Calorie per porzione:</span> {ricetta?.Calorie_per_porzione} kcal</p>
            <p><span className="font-semibold">Costo:</span> {ricetta?.Costo}</p>
            <p><span className="font-semibold">Porzioni:</span> Per {ricetta?.Dosi_per} persone</p>
            <p><span className="font-semibold">Tipologia dieta:</span> {ricetta?.Tipologia_dieta}</p>
            <p><span className="font-semibold">Tipologia piatti:</span> {ricetta?.Tipologia_piatti}</p>
          </div>

          {/* Ingredienti e Istruzioni */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Ingredienti:</h3>
            <p>{ricetta?.Ingredienti}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Istruzioni:</h3>
            <p>{ricetta?.Istruzioni}</p>
          </div>

          {/* Presentazione */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Presentazione:</h3>
            <p>{ricetta?.Presentazione}</p>
          </div>

          {/* Ingredienti_JSON */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Ingredienti_JSON:</h3>
            <p>{ricetta?.Ingredienti_JSON}</p>
          </div>

          {/* ID ricetta */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">ID:</h3>
            <p>{ricetta?.ID}</p>
          </div>

          {/* Blocco 2.5.3: Visualizzazione delle corrispondenze degli ingredienti */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Corrispondenze degli Ingredienti</h3>
            <ul className="list-disc pl-5">
              {ingredientMatches.map((match, index) => (
                <li key={index} className={match.alimento ? 'text-green-600' : 'text-yellow-600'}>
                  {match.ingredient}: {match.alimento || 'Nessuna corrispondenza trovata'}
                </li>
              ))}
            </ul>
          </div>

          {/* Blocco 2.5.4: Calorie Calculator */}
          {ricetta?.Ingredienti_JSON && ricetta.Dosi_per && (
            <div className="mt-8">
              <CalorieCalculator 
                Ingredienti_JSON={ricetta.Ingredienti_JSON}
                Dosi_per={ricetta.Dosi_per}
                onIngredientMatch={handleIngredientMatch}
              />
            </div>
          )}
        </CardContent>

        {/* Blocco 2.5.5: Footer della Card */}
        <CardFooter className="justify-center mt-6">
          <Link href="/ricette">
            <Button variant="outline">Torna alla lista delle ricette</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}