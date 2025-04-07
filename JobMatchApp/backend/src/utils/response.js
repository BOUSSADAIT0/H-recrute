// JobMatchApp\backend\src\utils\response.js

// Formater les réponses pour les requêtes réussies
const successResponse = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      data
    });
  };
  
  // Formater les réponses pour les erreurs
  const errorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  };
  
  // Gérer les erreurs de validation
  const validationErrorResponse = (res, errors) => {
    return res.status(422).json({
      success: false,
      errors
    });
  };
  
  module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse
  };