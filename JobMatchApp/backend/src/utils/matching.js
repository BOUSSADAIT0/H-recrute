// JobMatchApp\backend\src\utils\matching.js
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Prétraitement du texte
const preprocessText = (text) => {
  if (!text) return [];
  
  // Convertir en minuscules et tokeniser
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Filtrer les mots vides (stopwords) français et anglais
  const stopwords = [
    'le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'de', 'du', 'au', 'aux',
    'a', 'à', 'ce', 'ces', 'cette', 'en', 'par', 'pour', 'avec', 'sans', 'sur',
    'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'by', 'for', 'with', 'without',
    'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
    'i', 'you', 'he', 'she', 'we', 'they'
  ];
  
  // Filtrer et stemmer
  return tokens
    .filter(token => !stopwords.includes(token) && token.length > 2)
    .map(token => stemmer.stem(token));
};

// Calculer la similarité entre deux ensembles de compétences
const calculateSkillMatch = (candidateSkills, jobRequirements) => {
  if (!candidateSkills || !jobRequirements || 
      candidateSkills.length === 0 || jobRequirements.length === 0) {
    return 0;
  }
  
  // Prétraiter les compétences
  const processedCandidateSkills = candidateSkills.flatMap(skill => preprocessText(skill));
  const processedJobRequirements = jobRequirements.flatMap(req => preprocessText(req));
  
  // Calculer l'intersection
  const intersection = processedCandidateSkills.filter(skill => 
    processedJobRequirements.some(req => req === skill || req.includes(skill) || skill.includes(req))
  );
  
  // Calculer le score
  const union = new Set([...processedCandidateSkills, ...processedJobRequirements]);
  return (intersection.length / union.size) * 100;
};

// Calculer la compatibilité globale entre un candidat et une offre d'emploi
const calculateJobMatch = (candidate, jobOffer) => {
  // Poids des différents facteurs
  const weights = {
    skills: 0.6,
    location: 0.3,
    title: 0.1
  };
  
  // Correspondance des compétences
  const skillMatchScore = calculateSkillMatch(candidate.skills, jobOffer.requirements);
  
  // Correspondance de localisation
  const locationMatchScore = candidate.location.toLowerCase() === jobOffer.location.toLowerCase() ? 100 : 0;
  
  // Correspondance de titre
  const titleTokens = preprocessText(candidate.title);
  const jobTitleTokens = preprocessText(jobOffer.title);
  const titleIntersection = titleTokens.filter(token => jobTitleTokens.includes(token));
  const titleMatchScore = titleTokens.length > 0 ? 
    (titleIntersection.length / titleTokens.length) * 100 : 0;
  
  // Score global pondéré
  const overallScore = (
    skillMatchScore * weights.skills +
    locationMatchScore * weights.location +
    titleMatchScore * weights.title
  );
  
  return {
    overall: Math.round(overallScore),
    skills: Math.round(skillMatchScore),
    location: Math.round(locationMatchScore),
    title: Math.round(titleMatchScore)
  };
};

module.exports = {
  preprocessText,
  calculateSkillMatch,
  calculateJobMatch
};