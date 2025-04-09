/**
 * Fonctions utilitaires pour la validation des données
 */

/**
 * Vérifie si une valeur est un ID MongoDB valide
 * @param {string} id - L'ID à vérifier
 * @returns {boolean} True si l'ID est valide, sinon false
 */
const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
  };
  
  /**
   * Vérifie si une adresse email est valide
   * @param {string} email - L'email à vérifier
   * @returns {boolean} True si l'email est valide, sinon false
   */
  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  
  /**
   * Vérifie si une URL est valide
   * @param {string} url - L'URL à vérifier
   * @returns {boolean} True si l'URL est valide, sinon false
   */
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Valide que tous les champs requis sont présents
   * @param {Object} data - Les données à valider
   * @param {Array<string>} requiredFields - Les champs requis
   * @returns {Object} Résultat de la validation {isValid, missingFields}
   */
  const validateRequiredFields = (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => !data[field]);
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };
  
  /**
   * Nettoie les données d'entrée en retirant les champs non autorisés
   * @param {Object} data - Les données à nettoyer
   * @param {Array<string>} allowedFields - Les champs autorisés
   * @returns {Object} Les données nettoyées
   */
  const sanitizeData = (data, allowedFields) => {
    const sanitizedData = {};
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        sanitizedData[field] = data[field];
      }
    });
    
    return sanitizedData;
  };
  
  /**
   * Valide les valeurs d'énumération
   * @param {string} value - La valeur à valider
   * @param {Array<string>} allowedValues - Les valeurs autorisées
   * @returns {boolean} True si la valeur est valide, sinon false
   */
  const validateEnum = (value, allowedValues) => {
    return allowedValues.includes(value);
  };
  
  /**
   * Vérifie si une date est valide
   * @param {string|Date} date - La date à vérifier
   * @returns {boolean} True si la date est valide, sinon false
   */
  const isValidDate = (date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  };
  
  module.exports = {
    isValidObjectId,
    isValidEmail,
    isValidURL,
    validateRequiredFields,
    sanitizeData,
    validateEnum,
    isValidDate
  };