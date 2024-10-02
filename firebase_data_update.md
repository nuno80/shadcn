Prerequisiti:
Google Cloud SDK installato.
Firestore Database creato su Google Cloud.
Credenziali di accesso per Firestore (scarica il file JSON dalle impostazioni delle credenziali del tuo progetto Google Cloud).
Installazione delle dipendenze Python (inclusa la libreria google-cloud-firestore).
Ecco uno script Python per caricare i dati:

1. Installa le dipendenze:
Se non hai ancora installato le dipendenze, esegui il comando:

pip install google-cloud-firestore
pip install firebase-admin
npm install firebase@latest

2. Vai alla console firebse: clicca l'icona delle impostazioni -> impostazioni progetto -> account di servizio -> genera nuova chiave privata.

rinomina il file scaricato in service.json e salvalo nella stessa directory del file update.py che creeremo in seguito 

3. Crea il file update.py come segue:

import json
import firebase_admin
from firebase_admin import credentials, firestore

# Inizializzazione di Firestore
cred = credentials.Certificate('service.json') # Path al file delle credenziali JSON
firebase_admin.initialize_app(cred)
db = firestore.client()

# Dati da aggiungere
data = { inserisci i dati in formato JSON }

# Funzione per caricare i dati su Firestore
def upload_data():
    recipes_collection = db.collection('recipes')  # Crea una collezione "recipes"
    for recipe in data["recipes"]:
        recipes_collection.document(recipe["id"]).set(recipe)  # Usa "id" come ID del documento
        print(f"Added {recipe['title']}")

if __name__ == "__main__":
    upload_data()

4. esegui il file
python update.py

5. Make sure your Firestore security rules allow read access to the 'recipes' collection. In the Firebase Console, navigate to Firestore Database > Rules and update them to:


```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

This allows anyone to read from the 'recipes' collection but restricts write access. Adjust these rules according to your security needs.