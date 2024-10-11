'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import NutritionalCalculator from '@/components/NutritionalCalculator'; // Importa il componente

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

export default function RicettaPage() {
  const { id } = useParams(); // Ottieni l'id dalla route dinamica
  const [ricetta, setRicetta] = useState<Ricetta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRicetta = async () => {
      try {
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

    if (id) {
      getRicetta();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Caricamento in corso...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Errore: {error}</div>;
  }

  return (
    <div className="container mx-auto py-12">
      {/* Dettagli della ricetta */}
      <Card className="shadow-lg p-6 rounded-lg">
        <CardHeader className="flex flex-col items-center mb-6">
          <Avatar className="w-36 h-36 mb-4">
            <AvatarImage src={ricetta?.Immagine_URL} alt={ricetta?.Titolo} />
            <AvatarFallback>{ricetta?.Titolo.slice(0, 2) || 'RC'}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{ricetta?.Titolo}</CardTitle>
        </CardHeader>

        <CardContent className="text-lg">
          <p className="mb-4">
            <span className="font-semibold">Tempo di preparazione:</span> {ricetta?.Tempo_preparazione_totale} minuti
          </p>
          <p className="mb-4">
            <span className="font-semibold">Cottura:</span> {ricetta?.Cottura}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Preparazione:</span> {ricetta?.Preparazione}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Difficoltà:</span> {ricetta?.Difficolta}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Calorie per porzione:</span> {ricetta?.Calorie_per_porzione} kcal
          </p>
          <p className="mb-4">
            <span className="font-semibold">Costo:</span> {ricetta?.Costo}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Porzioni:</span> Per {ricetta?.Dosi_per} persone
          </p>
          <p className="mb-4">
            <span className="font-semibold">Ingredienti:</span> {ricetta?.Ingredienti}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Tipologia dieta:</span> {ricetta?.Tipologia_dieta}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Tipologia piatti:</span> {ricetta?.Tipologia_piatti}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Calorie calcolate:</span> {ricetta?.Calorie_calcolate} kcal
          </p>
          <p className="mb-4">
            <span className="font-semibold">Presentazione:</span> {ricetta?.Presentazione}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Istruzioni:</span> {ricetta?.Istruzioni}
          </p>

          {/* Nutritional Calculator */}
            {ricetta?.Ingredienti_JSON && typeof ricetta.Ingredienti_JSON === 'string' && (
              <div className="mt-8">
                <NutritionalCalculator recipe={{
                  ...ricetta, // Passa tutte le altre proprietà di `ricetta`
                  Ingredienti_JSON: ricetta.Ingredienti_JSON // Cast come stringa
                }} />
              </div>
            )}

        </CardContent>

        <CardFooter className="text-center">
          {/* Bottone per tornare alla lista delle ricette */}
          <div className="mb-8">
            <Link href="/ricette">
              <Button variant="outline">Torna alla lista delle ricette</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
