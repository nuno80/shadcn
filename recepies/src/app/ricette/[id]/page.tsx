'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

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
    return <div>Caricamento in corso...</div>
  }

  if (error) {
    return <div>Errore: {error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <Avatar>
          <AvatarImage src={ricetta?.Immagine_URL} alt={ricetta?.Titolo} />
          <AvatarFallback>{ricetta?.Titolo.slice(0, 2) || 'RC'}</AvatarFallback>
        </Avatar>
        <CardTitle>{ricetta?.Titolo}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Tempo di preparazione: {ricetta?.Tempo_preparazione_totale} minuti</p>
        <p>Difficoltà: {ricetta?.Difficolta}</p>
        <p>{ricetta?.Presentazione}</p>
        <p>Calorie per porzione: {ricetta?.Calorie_per_porzione}</p>
        <p>Costo: {ricetta?.Costo}</p>
        <p>Per {ricetta?.Dosi_per} persone</p>
      </CardContent>
      <CardFooter>
        <p>Cottura: {ricetta?.Cottura}</p>
      </CardFooter>
    </Card>
  )
}
