'use client'

import { useEffect, useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from '../config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import Navigation from './NavigationComponent'

interface Recipe {
  title: string,
  image: string,
  time: number,
  description: string,
  vegan: boolean,
  id: string
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const recipesCollection = collection(db, 'recipes')
        const recipesSnapshot = await getDocs(recipesCollection)
        const recipesList = recipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Recipe[]
        setRecipes(recipesList)z
      } catch (error) {
        console.error("Error fetching recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    getRecipes()
  }, [])

  if (loading) {
    return <div>Loading recipes...</div>
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto py-8 mt-[-1rem]">
        {recipes.length === 0 ? (
          <p>No recipes found. There might be an issue with the database connection.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map(recipe => (
              <Card key={recipe.id} className="flex flex-col justify-between">
                <CardHeader className="flex-row gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={recipe.image} alt={recipe.title} />
                    <AvatarFallback>
                      {recipe.title.slice(0,2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{recipe.title}</CardTitle>
                    <CardDescription>{recipe.time} mins to cook.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{recipe.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button>View Recipe</Button>
                  {recipe.vegan && <Badge variant="secondary">Vegan!</Badge>}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}