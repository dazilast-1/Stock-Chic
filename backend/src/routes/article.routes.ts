import express from 'express';
import Joi from 'joi';
import { supabase } from '../db/supabase';
import { authenticateToken, requireVendorOrManager } from '../middleware/auth.middleware';
import { 
  CreateArticleRequest, 
  UpdateArticleRequest, 
  ArticleWithDeclinaisons,
  ApiResponse,
  PaginationParams,
  PaginatedResponse
} from '../types/stock.types';

const router = express.Router();

// Schémas de validation
const createArticleSchema = Joi.object({
  reference: Joi.string().max(50).required(),
  nom: Joi.string().max(255).required(),
  marque: Joi.string().max(100).optional(),
  collection: Joi.string().valid('HIVER_2024', 'ETE_2024', 'AUTOMNE_2024', 'PRINTEMPS_2025').required(),
  prix_achat: Joi.number().min(0).precision(2).required(),
  prix_vente: Joi.number().min(0).precision(2).required(),
  declinaisons: Joi.array().items(
    Joi.object({
      taille: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL').required(),
      couleur: Joi.string().max(50).required(),
      quantite: Joi.number().integer().min(0).default(0),
      quantite_min: Joi.number().integer().min(0).default(5),
      code_barre: Joi.string().max(50).optional()
    })
  ).min(1).required()
});

const updateArticleSchema = Joi.object({
  nom: Joi.string().max(255).optional(),
  marque: Joi.string().max(100).optional(),
  collection: Joi.string().valid('HIVER_2024', 'ETE_2024', 'AUTOMNE_2024', 'PRINTEMPS_2025').optional(),
  prix_achat: Joi.number().min(0).precision(2).optional(),
  prix_vente: Joi.number().min(0).precision(2).optional()
});

// Route pour créer un article
router.post('/', authenticateToken, requireVendorOrManager, async (req: express.Request, res: express.Response) => {
  try {
    // Validation des données
    const { error, value } = createArticleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const articleData: CreateArticleRequest = value;

    // Vérifier si la référence existe déjà
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('reference', articleData.reference)
      .single();

    if (existingArticle) {
      return res.status(409).json({
        success: false,
        error: 'Un article avec cette référence existe déjà'
      });
    }

    // Vérifier les codes-barres uniques
    const codesBarres = articleData.declinaisons
      .map(d => d.code_barre)
      .filter(code => code);

    if (codesBarres.length > 0) {
      const { data: existingCodes } = await supabase
        .from('declinaisons')
        .select('code_barre')
        .in('code_barre', codesBarres);

      if (existingCodes && existingCodes.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Un ou plusieurs codes-barres existent déjà'
        });
      }
    }

    // Créer l'article
    const { data: newArticle, error: articleError } = await supabase
      .from('articles')
      .insert({
        reference: articleData.reference,
        nom: articleData.nom,
        marque: articleData.marque,
        collection: articleData.collection,
        prix_achat: articleData.prix_achat,
        prix_vente: articleData.prix_vente
      })
      .select()
      .single();

    if (articleError) {
      console.error('Erreur lors de la création de l\'article:', articleError);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la création de l\'article'
      });
    }

    // Créer les déclinaisons
    const declinaisonsData = articleData.declinaisons.map(declinaison => ({
      article_id: newArticle.id,
      taille: declinaison.taille,
      couleur: declinaison.couleur,
      quantite: declinaison.quantite,
      quantite_min: declinaison.quantite_min,
      code_barre: declinaison.code_barre
    }));

    const { data: newDeclinaisons, error: declinaisonsError } = await supabase
      .from('declinaisons')
      .insert(declinaisonsData)
      .select();

    if (declinaisonsError) {
      // Supprimer l'article créé en cas d'erreur
      await supabase.from('articles').delete().eq('id', newArticle.id);
      console.error('Erreur lors de la création des déclinaisons:', declinaisonsError);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la création des déclinaisons'
      });
    }

    // Retourner l'article complet avec ses déclinaisons
    const articleWithDeclinaisons: ArticleWithDeclinaisons = {
      ...newArticle,
      declinaisons: newDeclinaisons
    };

    res.status(201).json({
      success: true,
      data: articleWithDeclinaisons,
      message: 'Article créé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour récupérer tous les articles avec pagination
router.get('/', authenticateToken, requireVendorOrManager, async (req: express.Request, res: express.Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
      collection,
      marque,
      search
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Construire la requête
    let query = supabase
      .from('articles')
      .select(`
        *,
        declinaisons (*)
      `);

    // Filtres
    if (collection) {
      query = query.eq('collection', collection);
    }
    if (marque) {
      query = query.eq('marque', marque);
    }
    if (search) {
      query = query.or(`nom.ilike.%${search}%,reference.ilike.%${search}%`);
    }

    // Tri
    query = query.order(sortBy as string, { ascending: sortOrder === 'asc' });

    // Pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: articles, error, count } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des articles'
      });
    }

    const totalPages = Math.ceil((count || 0) / limitNum);

    const response: PaginatedResponse<ArticleWithDeclinaisons> = {
      data: articles as ArticleWithDeclinaisons[],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages
      }
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour récupérer un article par ID
router.get('/:id', authenticateToken, requireVendorOrManager, async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        declinaisons (*)
      `)
      .eq('id', id)
      .single();

    if (error || !article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }

    res.json({
      success: true,
      data: article as ArticleWithDeclinaisons
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour récupérer un article par référence
router.get('/reference/:reference', authenticateToken, requireVendorOrManager, async (req: express.Request, res: express.Response) => {
  try {
    const { reference } = req.params;

    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        declinaisons (*)
      `)
      .eq('reference', reference)
      .single();

    if (error || !article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }

    res.json({
      success: true,
      data: article as ArticleWithDeclinaisons
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour mettre à jour un article
router.put('/:id', authenticateToken, requireVendorOrManager, async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    // Validation des données
    const { error, value } = updateArticleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const updateData: UpdateArticleRequest = value;

    // Vérifier que l'article existe
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }

    // Mettre à jour l'article
    const { data: updatedArticle, error: updateError } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur lors de la mise à jour de l\'article:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour de l\'article'
      });
    }

    res.json({
      success: true,
      data: updatedArticle,
      message: 'Article mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour supprimer un article
router.delete('/:id', authenticateToken, requireVendorOrManager, async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    // Vérifier que l'article existe
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé'
      });
    }

    // Supprimer l'article (les déclinaisons seront supprimées automatiquement par CASCADE)
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Erreur lors de la suppression de l\'article:', deleteError);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression de l\'article'
      });
    }

    res.json({
      success: true,
      message: 'Article supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route pour récupérer les alertes de stock bas
router.get('/alerts/stock-bas', authenticateToken, requireVendorOrManager, async (req: express.Request, res: express.Response) => {
  try {
    const { data: alerts, error } = await supabase
      .from('alertes_stock_bas')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des alertes'
      });
    }

    res.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

export default router;

