/**
 * Données de seeding pour les offres d'emploi
 */

// Templates d'offres d'emploi
const jobTemplates = [
    {
      title: 'Développeur React Native',
      description: `
        Nous recherchons un développeur React Native passionné pour rejoindre notre équipe et participer à la création d'applications mobiles innovantes et performantes. Vous travaillerez sur des projets variés et stimulants, en utilisant les dernières technologies du marché.
        
        En tant que développeur React Native, vous serez responsable de la conception, du développement et de la maintenance d'applications mobiles cross-platform. Vous collaborerez étroitement avec les équipes de design, de backend et de produit pour livrer des applications de haute qualité.
      `,
      responsibilities: [
        "Développer des applications mobiles performantes et réactives avec React Native",
        "Collaborer avec l'équipe de conception pour implémenter des interfaces utilisateur attrayantes et intuitives",
        "Intégrer les APIs et services backend dans les applications mobiles",
        "Optimiser les performances des applications",
        "Participer à la revue de code et au processus d'assurance qualité",
        "Résoudre les problèmes techniques et déboguer les applications",
        "Rester à jour avec les dernières technologies et tendances dans le développement mobile"
      ],
      requirements: [
        "Expérience pratique avec React Native et JavaScript/TypeScript",
        "Bonne compréhension du cycle de vie des composants React",
        "Connaissance des outils de state management (Redux, Context API, MobX)",
        "Expérience avec l'intégration d'APIs REST et GraphQL",
        "Familiarité avec les outils de développement mobile (Android Studio, Xcode)",
        "Compréhension des principes de design réactif et d'UX",
        "Capacité à résoudre des problèmes complexes et à travailler en équipe"
      ]
    },
    {
      title: 'Développeur Frontend React',
      description: `
        Nous recherchons un développeur Frontend React talentueux pour rejoindre notre équipe en pleine croissance. Vous serez chargé de créer des interfaces utilisateur réactives, intuitives et esthétiques pour nos applications web.
        
        En tant que développeur Frontend, vous travaillerez en étroite collaboration avec nos designers UX/UI et nos développeurs backend pour créer des expériences utilisateur exceptionnelles. Vous participerez à toutes les phases du cycle de développement, de la conception à la mise en production.
      `,
      responsibilities: [
        "Développer des interfaces utilisateur interactives avec React et JavaScript/TypeScript",
        "Implémenter et maintenir des composants React réutilisables",
        "Collaborer avec les designers UX/UI pour transformer les maquettes en interfaces fonctionnelles",
        "Intégrer les APIs REST et GraphQL avec le frontend",
        "Optimiser les performances des applications web",
        "Participer aux revues de code et assurer la qualité du code",
        "Maintenir et améliorer les applications existantes"
      ],
      requirements: [
        "Expérience solide en React.js et maîtrise de JavaScript/TypeScript",
        "Bonne connaissance de HTML5, CSS3 et des préprocesseurs CSS",
        "Expérience avec les bibliothèques de state management (Redux, Context API)",
        "Compréhension des principes de conception responsive et des bonnes pratiques UX/UI",
        "Expérience avec les outils de build modernes (Webpack, Babel, etc.)",
        "Capacité à écrire du code propre, maintenable et bien testé",
        "Bonne communication et esprit d'équipe"
      ]
    },
    {
      title: 'Développeur Backend Node.js',
      description: `
        Nous recherchons un développeur Backend Node.js expérimenté pour rejoindre notre équipe technique. Vous serez responsable de la conception, du développement et de la maintenance de nos APIs et services backend.
        
        En tant que développeur Backend, vous travaillerez sur l'architecture des systèmes, l'optimisation des performances et la sécurité de nos applications. Vous collaborerez avec l'équipe frontend pour assurer une intégration fluide entre le frontend et le backend.
      `,
      responsibilities: [
        "Concevoir et développer des APIs RESTful et GraphQL avec Node.js",
        "Créer et maintenir des microservices évolutifs et performants",
        "Implémenter des stratégies de mise en cache et d'optimisation des performances",
        "Gérer les bases de données MongoDB et assurer l'intégrité des données",
        "Mettre en place et maintenir les tests automatisés",
        "Participer à la revue de code et au déploiement continu",
        "Collaborer avec l'équipe frontend pour définir les contrats d'API"
      ],
      requirements: [
        "Expérience significative avec Node.js et Express.js",
        "Bonne connaissance des bases de données NoSQL, en particulier MongoDB",
        "Expérience dans la conception et l'implémentation d'APIs RESTful et/ou GraphQL",
        "Compréhension des principes de sécurité web et des bonnes pratiques",
        "Familiarité avec les techniques de test (unit testing, integration testing)",
        "Connaissance des architectures microservices et des principes DevOps",
        "Capacité à résoudre des problèmes complexes et à travailler en autonomie"
      ]
    },
    {
      title: 'Développeur Full-Stack JavaScript',
      description: `
        Nous recherchons un développeur Full-Stack JavaScript talentueux pour rejoindre notre équipe dynamique. Vous participerez au développement complet de nos applications web, du backend au frontend, en utilisant les technologies JavaScript modernes.
        
        En tant que développeur Full-Stack, vous aurez l'opportunité de travailler sur toutes les couches de nos applications, d'implémenter de nouvelles fonctionnalités et d'améliorer les performances et l'expérience utilisateur de nos produits.
      `,
      responsibilities: [
        "Développer des applications web complètes utilisant des technologies JavaScript modernes",
        "Concevoir et implémenter des APIs RESTful et des services backend avec Node.js",
        "Créer des interfaces utilisateur réactives et intuitives avec React",
        "Implémenter et maintenir des bases de données MongoDB",
        "Participer à la conception technique et à l'architecture des applications",
        "Assurer la qualité du code grâce aux tests automatisés",
        "Collaborer avec les équipes produit et design pour définir les fonctionnalités"
      ],
      requirements: [
        "Expérience significative en développement full-stack JavaScript",
        "Maîtrise de Node.js, Express, React et MongoDB",
        "Bonne connaissance de HTML5, CSS3 et des frameworks CSS modernes",
        "Expérience avec les outils de state management (Redux, Context API)",
        "Compréhension des principes de conception responsive et d'UX",
        "Familiarité avec les méthodologies agiles et le développement itératif",
        "Capacité à apprendre rapidement de nouvelles technologies"
      ]
    },
    {
      title: 'Ingénieur DevOps',
      description: `
        Nous recherchons un ingénieur DevOps pour rejoindre notre équipe technique. Vous serez responsable de la mise en place et de la maintenance de notre infrastructure cloud, de nos pipelines CI/CD et de nos environnements de déploiement.
        
        En tant qu'ingénieur DevOps, vous travaillerez en étroite collaboration avec les équipes de développement pour automatiser les processus de build, de test et de déploiement, et pour optimiser les performances et la fiabilité de nos systèmes.
      `,
      responsibilities: [
        "Mettre en place et maintenir l'infrastructure cloud (AWS, GCP ou Azure)",
        "Concevoir et implémenter des pipelines CI/CD robustes",
        "Automatiser les processus de déploiement et les tâches récurrentes",
        "Surveiller la performance et la disponibilité des systèmes",
        "Résoudre les problèmes d'infrastructure et optimiser les ressources",
        "Collaborer avec les équipes de développement pour améliorer les pratiques DevOps",
        "Mettre en œuvre des stratégies de sauvegarde, de sécurité et de reprise après sinistre"
      ],
      requirements: [
        "Expérience en administration de systèmes Linux et en automatisation",
        "Connaissance des plateformes cloud (AWS, GCP ou Azure)",
        "Expérience avec les outils de conteneurisation (Docker, Kubernetes)",
        "Maîtrise des outils CI/CD (Jenkins, GitHub Actions, GitLab CI)",
        "Compétences en scripting (Bash, Python)",
        "Connaissance des principes de l'Infrastructure as Code (Terraform, CloudFormation)",
        "Compréhension des bonnes pratiques de sécurité et de surveillance"
      ]
    },
    {
      title: 'UX/UI Designer',
      description: `
        Nous recherchons un UX/UI Designer créatif et orienté utilisateur pour rejoindre notre équipe produit. Vous serez responsable de la conception d'interfaces utilisateur intuitives, esthétiques et fonctionnelles pour nos applications web et mobiles.
        
        En tant que UX/UI Designer, vous travaillerez en étroite collaboration avec les équipes produit et développement pour comprendre les besoins des utilisateurs, concevoir des solutions et créer des expériences utilisateur exceptionnelles.
      `,
      responsibilities: [
        "Créer des wireframes, des maquettes et des prototypes interactifs",
        "Concevoir des interfaces utilisateur intuitives et esthétiques",
        "Réaliser des recherches utilisateurs et des tests d'utilisabilité",
        "Développer et maintenir notre système de design",
        "Collaborer avec les développeurs pour implémenter les designs",
        "Recueillir et analyser les feedbacks utilisateurs pour améliorer l'UX",
        "Rester à jour avec les dernières tendances et meilleures pratiques en design UX/UI"
      ],
      requirements: [
        "Expérience significative en conception d'interfaces pour applications web et mobiles",
        "Maîtrise des outils de design (Figma, Sketch, Adobe XD)",
        "Solide portfolio démontrant des compétences en UX et UI design",
        "Connaissance des principes de design d'interaction et d'architecture de l'information",
        "Capacité à communiquer efficacement les concepts de design",
        "Expérience en design de systèmes et en création de bibliothèques de composants",
        "Sensibilité aux besoins des utilisateurs et à l'accessibilité"
      ]
    },
    {
      title: 'Data Scientist',
      description: `
        Nous recherchons un Data Scientist talentueux pour rejoindre notre équipe d'analyse de données. Vous serez chargé d'extraire des insights pertinents à partir de nos données et de développer des modèles prédictifs pour améliorer nos produits et services.
        
        En tant que Data Scientist, vous travaillerez sur l'ensemble du cycle de vie des projets de data science, de l'exploration des données à la mise en production des modèles, en passant par l'expérimentation et l'évaluation.
      `,
      responsibilities: [
        "Analyser de grands ensembles de données pour en extraire des insights actionnables",
        "Développer et implémenter des modèles de machine learning et d'intelligence artificielle",
        "Collaborer avec les équipes produit pour identifier les opportunités d'utilisation des données",
        "Créer des visualisations pour communiquer efficacement les résultats d'analyse",
        "Optimiser les performances des modèles prédictifs",
        "Rester à jour avec les dernières avancées en data science et machine learning",
        "Contribuer à l'amélioration continue de nos processus d'analyse de données"
      ],
      requirements: [
        "Solide formation en mathématiques, statistiques ou domaine connexe",
        "Expérience en développement de modèles de machine learning",
        "Maîtrise de Python et des bibliothèques de data science (NumPy, Pandas, Scikit-learn)",
        "Expérience avec les outils de visualisation de données (Matplotlib, Seaborn, Tableau)",
        "Connaissance des principes d'apprentissage statistique et d'analyse de données",
        "Familiarité avec les bases de données SQL et NoSQL",
        "Capacité à communiquer des concepts techniques à des non-spécialistes"
      ]
    },
    {
      title: 'Product Manager',
      description: `
        Nous recherchons un Product Manager passionné pour rejoindre notre équipe. Vous serez responsable de la définition et de l'exécution de la stratégie produit, en collaboration étroite avec les équipes de design, de développement et de marketing.
        
        En tant que Product Manager, vous devrez comprendre les besoins des utilisateurs, définir les fonctionnalités prioritaires et assurer la livraison de produits de haute qualité qui répondent aux attentes du marché.
      `,
      responsibilities: [
        "Définir la vision et la stratégie produit en alignement avec les objectifs de l'entreprise",
        "Recueillir et analyser les feedbacks utilisateurs pour identifier les opportunités d'amélioration",
        "Rédiger les spécifications fonctionnelles détaillées",
        "Travailler en étroite collaboration avec les équipes de développement et de design",
        "Prioriser les fonctionnalités dans la roadmap produit",
        "Suivre les KPIs et mesurer l'impact des nouvelles fonctionnalités",
        "Communiquer efficacement sur l'avancement du produit auprès des parties prenantes"
      ],
      requirements: [
        "Expérience significative en gestion de produit, idéalement dans le secteur tech",
        "Solide compréhension des méthodologies agiles (Scrum, Kanban)",
        "Capacité à analyser les données et à prendre des décisions basées sur les métriques",
        "Excellentes compétences en communication et en présentation",
        "Expérience dans la conduite d'interviews utilisateurs et de tests d'utilisabilité",
        "Connaissance des outils de gestion de produit (Jira, Asana, Trello)",
        "Esprit analytique et capacité à résoudre des problèmes complexes"
      ]
    }
  ];
  
  /**
   * Retourne une offre d'emploi aléatoire
   * @returns {Object} Offre d'emploi
   */
  const getRandomJob = () => {
    return jobTemplates[Math.floor(Math.random() * jobTemplates.length)];
  };
  
  module.exports = {
    jobTemplates,
    getRandomJob
  };