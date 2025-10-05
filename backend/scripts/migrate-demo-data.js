const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateDemoData() {
  console.log('🚀 Début de la migration des données de démonstration...');

  try {
    // 1. Créer les collections
    console.log('📁 Création des collections...');
    const collections = [
      { nom: 'Vêtements', description: 'Collection de vêtements', couleur: '#3B82F6' },
      { nom: 'Accessoires', description: 'Collection d\'accessoires', couleur: '#10B981' },
      { nom: 'Chaussures', description: 'Collection de chaussures', couleur: '#F59E0B' },
      { nom: 'Électronique', description: 'Collection d\'électronique', couleur: '#8B5CF6' }
    ];

    const { data: collectionsData, error: collectionsError } = await supabase
      .from('collections')
      .insert(collections)
      .select();

    if (collectionsError) {
      console.error('❌ Erreur lors de la création des collections:', collectionsError);
      return;
    }

    console.log('✅ Collections créées:', collectionsData.length);

    // 2. Créer les articles de démonstration
    console.log('📦 Création des articles...');
    const articles = [
      {
        nom: 'T-shirt Basic Blanc',
        description: 'T-shirt en coton bio, coupe classique',
        prix_achat: 8.50,
        prix_vente: 19.90,
        collection_id: collectionsData[0].id
      },
      {
        nom: 'Jean Slim Noir',
        description: 'Jean slim en denim stretch',
        prix_achat: 25.00,
        prix_vente: 59.90,
        collection_id: collectionsData[0].id
      },
      {
        nom: 'Sweat à Capuche Gris',
        description: 'Sweat confortable avec capuche',
        prix_achat: 15.00,
        prix_vente: 39.90,
        collection_id: collectionsData[0].id
      },
      {
        nom: 'Robe Élégante Noire',
        description: 'Robe cocktail en soie',
        prix_achat: 35.00,
        prix_vente: 89.90,
        collection_id: collectionsData[0].id
      },
      {
        nom: 'Sac à Main Cuir',
        description: 'Sac en cuir véritable, compartiments multiples',
        prix_achat: 45.00,
        prix_vente: 129.90,
        collection_id: collectionsData[1].id
      },
      {
        nom: 'Chaussures Sport Blanches',
        description: 'Chaussures de sport respirantes',
        prix_achat: 30.00,
        prix_vente: 79.90,
        collection_id: collectionsData[2].id
      },
      {
        nom: 'Écouteurs Bluetooth',
        description: 'Écouteurs sans fil avec réduction de bruit',
        prix_achat: 25.00,
        prix_vente: 69.90,
        collection_id: collectionsData[3].id
      },
      {
        nom: 'Montre Connectée',
        description: 'Montre intelligente avec GPS',
        prix_achat: 80.00,
        prix_vente: 199.90,
        collection_id: collectionsData[3].id
      },
      {
        nom: 'Pantalon Cargo Vert',
        description: 'Pantalon cargo avec poches multiples',
        prix_achat: 20.00,
        prix_vente: 49.90,
        collection_id: collectionsData[0].id
      },
      {
        nom: 'Blouse Professionnelle',
        description: 'Blouse en polyester résistant',
        prix_achat: 18.00,
        prix_vente: 45.90,
        collection_id: collectionsData[0].id
      }
    ];

    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .insert(articles)
      .select();

    if (articlesError) {
      console.error('❌ Erreur lors de la création des articles:', articlesError);
      return;
    }

    console.log('✅ Articles créés:', articlesData.length);

    // 3. Créer les déclinaisons
    console.log('🎨 Création des déclinaisons...');
    const declinaisons = [];

    articlesData.forEach((article, index) => {
      if (article.nom.includes('T-shirt')) {
        ['S', 'M', 'L', 'XL'].forEach((taille, i) => {
          declinaisons.push({
            article_id: article.id,
            taille,
            couleur: 'Blanc',
            quantite: Math.floor(Math.random() * 20) + 5,
            quantite_min: 5
          });
        });
      } else if (article.nom.includes('Jean')) {
        ['28', '30', '32', '34', '36'].forEach((taille, i) => {
          declinaisons.push({
            article_id: article.id,
            taille,
            couleur: 'Noir',
            quantite: Math.floor(Math.random() * 15) + 3,
            quantite_min: 5
          });
        });
      } else if (article.nom.includes('Sweat')) {
        ['S', 'M', 'L', 'XL'].forEach((taille, i) => {
          declinaisons.push({
            article_id: article.id,
            taille,
            couleur: 'Gris',
            quantite: Math.floor(Math.random() * 12) + 4,
            quantite_min: 5
          });
        });
      } else if (article.nom.includes('Robe')) {
        ['XS', 'S', 'M', 'L'].forEach((taille, i) => {
          declinaisons.push({
            article_id: article.id,
            taille,
            couleur: 'Noir',
            quantite: Math.floor(Math.random() * 8) + 2,
            quantite_min: 3
          });
        });
      } else if (article.nom.includes('Sac')) {
        declinaisons.push({
          article_id: article.id,
          couleur: 'Brun',
          quantite: Math.floor(Math.random() * 10) + 3,
          quantite_min: 2
        });
      } else if (article.nom.includes('Chaussures')) {
        ['38', '39', '40', '41', '42', '43'].forEach((taille, i) => {
          declinaisons.push({
            article_id: article.id,
            taille,
            couleur: 'Blanc',
            quantite: Math.floor(Math.random() * 8) + 2,
            quantite_min: 3
          });
        });
      } else if (article.nom.includes('Écouteurs')) {
        declinaisons.push({
          article_id: article.id,
          couleur: 'Noir',
          quantite: Math.floor(Math.random() * 15) + 5,
          quantite_min: 5
        });
      } else if (article.nom.includes('Montre')) {
        declinaisons.push({
          article_id: article.id,
          couleur: 'Noir',
          quantite: Math.floor(Math.random() * 10) + 3,
          quantite_min: 3
        });
      } else if (article.nom.includes('Pantalon')) {
        ['S', 'M', 'L', 'XL'].forEach((taille, i) => {
          declinaisons.push({
            article_id: article.id,
            taille,
            couleur: 'Vert',
            quantite: Math.floor(Math.random() * 12) + 3,
            quantite_min: 5
          });
        });
      } else if (article.nom.includes('Blouse')) {
        ['S', 'M', 'L', 'XL'].forEach((taille, i) => {
          declinaisons.push({
            article_id: article.id,
            taille,
            couleur: 'Blanc',
            quantite: Math.floor(Math.random() * 15) + 4,
            quantite_min: 5
          });
        });
      }
    });

    const { data: declinaisonsData, error: declinaisonsError } = await supabase
      .from('declinaisons')
      .insert(declinaisons)
      .select();

    if (declinaisonsError) {
      console.error('❌ Erreur lors de la création des déclinaisons:', declinaisonsError);
      return;
    }

    console.log('✅ Déclinaisons créées:', declinaisonsData.length);

    // 4. Créer quelques ventes de démonstration
    console.log('💰 Création des ventes de démonstration...');
    
    // Générer un numéro de vente
    const venteNumber = `V${String(Date.now()).slice(-4)}`;
    
    const ventes = [
      {
        numero_vente: venteNumber,
        client_nom: 'Marie Dubois',
        client_telephone: '06 12 34 56 78',
        montant_total: 89.90,
        montant_paye: 89.90,
        methode_paiement: 'carte'
      }
    ];

    const { data: ventesData, error: ventesError } = await supabase
      .from('ventes')
      .insert(ventes)
      .select();

    if (ventesError) {
      console.error('❌ Erreur lors de la création des ventes:', ventesError);
      return;
    }

    // 5. Créer des détails de vente
    if (ventesData && ventesData.length > 0) {
      const venteDetails = [
        {
          vente_id: ventesData[0].id,
          declinaison_id: declinaisonsData[0].id,
          quantite: 2,
          prix_unitaire: 19.90
        },
        {
          vente_id: ventesData[0].id,
          declinaison_id: declinaisonsData[5].id,
          quantite: 1,
          prix_unitaire: 59.90
        }
      ];

      const { error: detailsError } = await supabase
        .from('vente_details')
        .insert(venteDetails);

      if (detailsError) {
        console.error('❌ Erreur lors de la création des détails de vente:', detailsError);
        return;
      }

      console.log('✅ Détails de vente créés');
    }

    console.log('🎉 Migration terminée avec succès !');
    console.log(`📊 Données créées :
    - ${collectionsData.length} collections
    - ${articlesData.length} articles
    - ${declinaisonsData.length} déclinaisons
    - ${ventesData ? ventesData.length : 0} ventes`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

// Exécuter la migration
migrateDemoData().then(() => {
  console.log('✅ Script terminé');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
