<template>
  
  
  <!-- Filters -->
  <section class="filtres">
    <h3>Filtres</h3>
			
    <div style="font-weight: bold;">Recherche</div> 
    <input type="text" v-model="recherche" placeholder="Rechercher une pièce..." />
    
    <div style="font-weight: bold;">Catégorie</div>
    <select v-model="categorieSelectionnee">
      <option value="">Toutes les catégories</option>
      <option v-for="categorie in categories" :key="categorie" :value="categorie">
        {{ categorie }}
      </option>
    </select>
    
    <div style="font-weight: bold;">Disponibilité</div>
    <select v-model="disponibiliteSelectionnee">
      <option value="">Toutes les disponibilités</option>
      <option value="enStock">En stock uniquement</option>
      <option value="rupture">Rupture de stock uniquement</option>
    </select>
    
    <div style="font-weight: bold;">Trie par prix</div>
    <select v-model="triPrix">
      <option value="">Aucun tri</option>
      <option value="croissant">Prix croissant</option>
      <option value="decroissant">Prix décroissant</option>
    </select>
  </section>

  <!-- Product List -->
  <section class="fiches">
    <div v-if="piecesFiltrees.length === 0">Aucune pièce disponible.</div>
    <div v-for="piece in piecesFiltrees" :key="piece.id" class="fiche">
      <img :src="piece.image" :alt="piece.nom" />
      <h2>{{ piece.nom }}</h2>
      <p>Prix : {{ piece.prix }} €</p>
      <p v-if="piece.disponible" class="dispo">En stock</p>
      <p v-else class="rupture">Rupture de stock</p>
      <button @click="ajouterAuPanier(piece)">Ajouter au panier</button>
    </div>
  </section>

  <!-- Panier Section -->
  <section class="panier">
    <h3>Votre Panier</h3>
    <ul>
      <li v-for="(item, index) in panier" :key="index">
        {{ item.nom }} - {{ item.prix }} €
        <button @click="retirerDuPanier(index)">Retirer</button>
      </li>
    </ul>
    <p v-if="panier.length === 0">Votre panier est vide.</p>
  </section>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      pieces: [],
      recherche: "",
      categorieSelectionnee: "",
      disponibiliteSelectionnee: "",
      triPrix: "",
      panier: [] // Panier for storing the added pieces
    };
  },
  
    
  mounted(){
    fetch("/data/pieces-autos.json")
    .then(response => response.json())
    .then(data => {
      this.pieces = data;
    })
    .catch(err => console.error("Erreur lors du chargement des données :", err));
  },
 
  computed: {
    categories() {
      console.log(Array.isArray(this.pieces));
      const categoriesUniques = new Set(this.pieces.map(piece => piece.categorie));
      return Array.from(categoriesUniques);
    },
    piecesFiltrees() {
      let piecesFiltres = this.pieces.filter(piece => {
        // Real-time search and category filter
        const matchesSearch = piece.nom.toLowerCase().includes(this.recherche.toLowerCase());
        const matchesCategory = this.categorieSelectionnee === "" || piece.categorie === this.categorieSelectionnee;
        
        let matchesAvailability = true;
        if (this.disponibiliteSelectionnee === "enStock") {
          matchesAvailability = piece.disponible;
        } else if (this.disponibiliteSelectionnee === "rupture") {
          matchesAvailability = !piece.disponible;
        }

        return matchesSearch && matchesCategory && matchesAvailability;
      });

      // Apply price sorting if selected
      if (this.triPrix === "croissant") {
        piecesFiltres = piecesFiltres.sort((a, b) => a.prix - b.prix);
      } else if (this.triPrix === "decroissant") {
        piecesFiltres = piecesFiltres.sort((a, b) => b.prix - a.prix);
      }

      return piecesFiltres;
    }
  },
  methods: {
    ajouterAuPanier(piece) {
      this.panier.push(piece); // Adds the selected piece to the panier
    },
    retirerDuPanier(index) {
      this.panier.splice(index, 1); // Removes the selected piece from the panier
    }
  }
}
</script>

<style>
.filtres {
  margin-bottom: 20px;
}

.filtres input, .filtres select {
  padding: 8px;
  margin: 5px;
}

.fiches {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.fiche {
  border: 1px solid #ccc;
  padding: 10px;
  width: 200px;
  text-align: center;
}

.dispo {
  color: green;
}

.rupture {
  color: red;
}

.panier {
  margin-top: 20px;
  border-top: 2px solid #ccc;
  padding-top: 10px;
}

.panier ul {
  list-style-type: none;
  padding: 0;
}

.panier li {
  padding: 5px;
  border-bottom: 1px solid #ddd;
}
</style>

