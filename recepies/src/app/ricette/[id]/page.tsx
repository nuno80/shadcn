'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface Ricetta {
  Titolo: string
  Immagine_URL: string
  Tempo_preparazione_totale: number
  Presentazione: string
  Tipologia_dieta: string
  ID: string
  Difficolta: string
  Calorie_per_porzione: number
  Costo: string
  Cottura: string
  Dosi_per: number
}

export default function RicettaPage() {
  const { id } = useParams() // Ottieni l'id dalla route dinamica
  const [ricetta, setRicetta] = useState<Ricetta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getRicetta = async () => {
      try {
        const docRef = doc(db, 'ricette', id as string)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setRicetta(docSnap.data() as Ricetta)
        } else {
          setError('Ricetta non trovata')
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      getRicetta()
    }
  }, [id])

  if (loading) {
    return <div className="text-center py-8">Caricamento in corso...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Errore: {error}</div>
  }

  return (
    <div className="container mx-auto py-12">

      {/* Dettagli della ricetta */}
      <Card className="shadow-lg p-6 rounded-lg">
        <CardHeader className="flex flex-col items-center mb-6">
          <Avatar className="w-32 h-32 mb-4">
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
            <span className="font-semibold">Cottura:</span> {ricetta?.Cottura}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Presentazione:</span> {ricetta?.Presentazione}
          </p>
        </CardContent>

        <CardFooter className="text-center">
                
          <div className="mb-8">
            <Link href="/ricette">
              <Button variant="outline">Torna alla lista delle ricette</Button>
            </Link>
          </div>

        </CardFooter>
      </Card>
    </div>
  )
}
