# Projet d'Upload de Fichiers par Chunks

Ce projet permet d'uploader des fichiers volumineux en les divisant en petits morceaux (chunks) et en les envoyant au serveur Django. Le frontend est développé avec React, et le backend avec Django.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js (v20.18.1)** (pour le frontend React)
- **Python 3.11.5** (pour le backend Django)
- **pip 25.0.1** (gestionnaire de paquets Python)



## Installation et Lancement
---
### Backend (Django)

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/nassim-larafa/TestTechUploadFile.git
   cd TestTechnique/backend
   ```

2. **Créer un environnement virtuel :**
   ```bash
   python -m venv virtualenvName
   cd virtualenvName
   ```

   - Sur macOS :
     ```bash
     source bin/activate
     ```
   - Sur Windows :
     ```bash
     Scripts\activate
     ```

3. **Installer les dépendances :**
   ```bash
   cd ..
   pip install -r requirements.txt
   ```

4. **Appliquer les migrations :**
   ```bash
   cd chunk_upload_backend
   python manage.py makemigrations
   python manage.py migrate
   ```
5. **Lancer le serveur Django :**
   ```bash
   python manage.py runserver
   
   ```

---

### Frontend (React)

1. **Accéder au dossier du frontend :**
   ```bash
   cd TestTechnique/Frontend
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer l'application :**
   ```bash
   npm start
   ```

---
### En cas d'interruption 
En cas d'interruption, pas de panique ! L'upload reprendra automatiquement à partir de la dernière progression interrompue.


---
**Auteur :** Larafa Nassim

