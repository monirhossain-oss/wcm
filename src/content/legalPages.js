const freezePage = (page) => Object.freeze({
  ...page,
  sections: Object.freeze(page.sections.map((section) => Object.freeze({
    ...section,
    bullets: Object.freeze(section.bullets),
  }))),
});

export const privacyPolicy = Object.freeze({
  fr: freezePage({
    title: 'Politique de confidentialité',
    effectiveDate: '25 février 2026',
    intro: 'La présente Politique de confidentialité explique comment World Culture Marketplace (« WCM », « nous ») collecte, stocke, traite et protège vos données personnelles lorsque vous utilisez worldculturemarketplace.com. En utilisant la Plateforme, vous acceptez les pratiques décrites ci-dessous.',
    sections: [
      { heading: '1. Données que nous collectons', bullets: ['Les informations que vous fournissez : nom, adresse e-mail, nom d’utilisateur, mot de passe chiffré, profil de créateur, contributions culturelles, communications et fichiers envoyés.', 'Les données collectées automatiquement : adresse IP, navigateur, appareil, système d’exploitation, pages consultées, durée de visite, interactions, URL de provenance et géolocalisation approximative.', 'Les données de tiers peuvent provenir d’outils d’analytics, de pixels publicitaires, de réseaux publicitaires ou de services de connexion sociale activés.'] },
      { heading: '2. Motifs du traitement', bullets: ['Votre consentement, notamment pour les cookies, la newsletter, l’envoi de contenu ou les communications demandées.', 'L’exécution d’un contrat afin de gérer votre compte, publier un profil de créateur, permettre les contributions et fournir les services de visibilité.', 'Nos intérêts légitimes : sécurité, maintenance, amélioration des performances, analyse d’utilisation, prévention des abus et protection de l’intégrité culturelle.', 'Le respect de nos obligations légales et des demandes valables des autorités.'] },
      { heading: '3. Utilisation de vos données', bullets: ['Exploiter la Plateforme, authentifier les utilisateurs, publier le contenu culturel et fournir les outils destinés aux créateurs.', 'Améliorer l’expérience utilisateur, sécuriser le service, analyser le trafic et communiquer les mises à jour, alertes ou messages d’assistance.', 'Soutenir les fonctionnalités de publicité et de visibilité. Nous ne vendons pas vos données personnelles.'] },
      { heading: '4. Cookies et technologies de suivi', bullets: ['Nous utilisons des cookies pour les fonctions essentielles, les sessions de connexion, les préférences, les mesures d’audience et la publicité.', 'Vous pouvez accepter ou refuser les cookies non essentiels, personnaliser vos choix et retirer votre consentement à tout moment.', 'Consultez notre Politique relative aux cookies pour obtenir le détail de ces pratiques.'] },
      { heading: '5. Partage des données', bullets: ['Avec nos prestataires : hébergement, analytics, partenaires publicitaires, sauvegarde et e-mail, soumis à des obligations de confidentialité.', 'Avec les autorités lorsque la loi, une décision de justice ou une obligation réglementaire l’exige.', 'Avec les autres utilisateurs lorsque votre profil de créateur ou votre contenu culturel est public.', 'Dans le cadre d’une fusion ou d’un transfert d’activité, avec un niveau de protection équivalent.'] },
      { heading: '6. Sécurité des données', bullets: ['Nous utilisons notamment le chiffrement SSL, le hachage des mots de passe, des contrôles d’accès limités, des pare-feux et des sauvegardes régulières.', 'Aucun système n’est entièrement sûr ; nous appliquons néanmoins les normes de sécurité usuelles.'] },
      { heading: '7. Conservation des données', bullets: ['Les comptes sont conservés jusqu’à leur suppression, le contenu des créateurs jusqu’à une demande de retrait, et les données d’analytics conformément aux réglages des fournisseurs concernés.'] },
      { heading: '8. Transferts internationaux', bullets: ['Tout transfert de données hors de l’Union européenne s’effectue au moyen de clauses contractuelles types et de sous-traitants conformes au RGPD.'] },
      { heading: '9. Vos droits au titre du RGPD', bullets: ['Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, l’opposition et la portabilité de vos données.', 'Vous pouvez retirer votre consentement à tout moment et introduire une réclamation auprès d’une autorité de contrôle.'] },
      { heading: '10. Vie privée des enfants', bullets: ['La Plateforme n’est pas destinée aux personnes de moins de 16 ans.'] },
      { heading: '11. Liens vers des tiers', bullets: ['WCM n’est pas responsable des pratiques de confidentialité des sites externes accessibles depuis la Plateforme.'] },
      { heading: '12. Modifications et contact', bullets: ['Nous pouvons mettre à jour cette politique ; la poursuite de l’utilisation de la Plateforme vaut acceptation des modifications.', 'Pour toute question : contact@worldculturemarketplace.com. World Culture Marketplace (WCM), 50 Avenue des Champs-Élysées, 75008 Paris, France ; Washington, USA.'] },
    ],
  }),
});

export const termsAndConditions = Object.freeze({
  fr: freezePage({
    title: 'Conditions générales',
    effectiveDate: '25 février 2026',
    intro: 'Les présentes Conditions générales régissent votre accès à World Culture Marketplace et son utilisation. En créant un compte ou en utilisant la Plateforme, vous acceptez ces Conditions.',
    sections: [
      { heading: '1. La Plateforme', bullets: ['WCM est une place de marché culturelle destinée à la découverte, à la présentation et à la visibilité de contenus, de créateurs et de traditions culturelles.', 'WCM peut modifier, suspendre ou retirer une fonctionnalité lorsque cela est nécessaire au fonctionnement, à la sécurité ou à l’évolution du service.'] },
      { heading: '2. Éligibilité et comptes', bullets: ['Vous devez fournir des informations exactes, protéger vos identifiants et signaler rapidement tout accès non autorisé.', 'Vous êtes responsable de l’activité réalisée depuis votre compte et devez respecter les lois applicables.'] },
      { heading: '3. Contenu et contributions', bullets: ['Vous conservez vos droits sur votre contenu, mais accordez à WCM la licence nécessaire pour l’héberger, l’afficher, le distribuer et le promouvoir via la Plateforme.', 'Vous garantissez disposer des droits nécessaires et que votre contenu n’enfreint pas les droits de tiers, la loi ou les règles de la communauté.'] },
      { heading: '4. Règles de conduite', bullets: ['Il est interdit de publier du contenu illégal, trompeur, discriminatoire, haineux, diffamatoire, frauduleux, malveillant ou portant atteinte à la propriété intellectuelle.', 'Il est interdit de contourner la sécurité, collecter des données sans autorisation, usurper une identité ou perturber le fonctionnement de la Plateforme.'] },
      { heading: '5. Modération', bullets: ['WCM peut examiner, refuser, retirer, bloquer ou modifier la visibilité d’un contenu ou d’un compte qui ne respecte pas ces Conditions ou les lois applicables.', 'Les décisions de modération visent à préserver la sécurité, la qualité et l’intégrité culturelle de la Plateforme.'] },
      { heading: '6. Services payants et publicité', bullets: ['Les fonctionnalités payantes, promotions et services publicitaires sont soumis aux prix et aux informations présentés au moment de l’achat.', 'Les frais, taxes, annulations et remboursements sont traités conformément aux règles applicables au service concerné.'] },
      { heading: '7. Propriété intellectuelle', bullets: ['Les marques, logiciels, design, textes et éléments de WCM sont protégés. Aucun droit ne vous est accordé en dehors de l’utilisation autorisée de la Plateforme.', 'Respectez les droits d’auteur, marques et autres droits de tiers lorsque vous publiez ou utilisez du contenu.'] },
      { heading: '8. Liens et services de tiers', bullets: ['WCM n’est pas responsable des sites, contenus, produits ou pratiques de services tiers auxquels la Plateforme peut renvoyer.'] },
      { heading: '9. Exclusion et limitation de responsabilité', bullets: ['La Plateforme est fournie dans les limites prévues par la loi ; WCM ne garantit pas une disponibilité ininterrompue ni l’absence totale d’erreurs.', 'Dans la mesure permise par la loi, WCM ne répond pas des dommages indirects, accessoires, spéciaux ou consécutifs liés à l’utilisation de la Plateforme.'] },
      { heading: '10. Résiliation', bullets: ['Vous pouvez cesser d’utiliser la Plateforme à tout moment. WCM peut suspendre ou résilier l’accès en cas de violation des Conditions ou de risque pour le service.'] },
      { heading: '11. Droit applicable et modifications', bullets: ['Les présentes Conditions sont interprétées conformément au droit applicable. Tout litige relève des juridictions compétentes, sous réserve des règles impératives applicables.', 'Nous pouvons mettre à jour ces Conditions ; la date de mise à jour apparaîtra sur cette page.'] },
      { heading: '12. Contact', bullets: ['Pour toute question juridique : contact@worldculturemarketplace.com.'] },
    ],
  }),
});

export const cookiePolicy = Object.freeze({
  fr: freezePage({
    title: 'Politique relative aux cookies',
    effectiveDate: '25 février 2026',
    intro: 'Cette Politique explique comment WCM utilise les cookies et technologies similaires sur worldculturemarketplace.com. En utilisant la Plateforme, vous acceptez le stockage et l’utilisation des cookies conformément à vos choix.',
    sections: [
      { heading: '1. Que sont les cookies ?', bullets: ['Les cookies sont de petits fichiers texte enregistrés sur votre appareil. Ils permettent de mémoriser vos préférences, améliorer les performances, mesurer l’audience, afficher correctement le contenu et soutenir certaines fonctions publicitaires.', 'Ils peuvent être de session ou persistants, déposés par WCM ou par un tiers.'] },
      { heading: '2. Catégories de cookies utilisées', bullets: ['Cookies essentiels : fonctionnement du site, connexion sécurisée, gestion de session, équilibrage de charge et prévention des abus ; ils ne peuvent pas être désactivés.', 'Cookies de performance et d’analytics : navigation, durée de session, appareils et sources de trafic, au moyen notamment d’outils tels que Google Analytics ou Meta Pixel.', 'Cookies de préférence : langue, région, choix d’affichage et réglages enregistrés.', 'Cookies publicitaires : mesure des annonces, listes sponsorisées, clics, impressions et retargeting lorsque les outils correspondants sont activés.'] },
      { heading: '3. Consentement', bullets: ['Lors de votre première visite, une bannière vous permet d’accepter tous les cookies, de refuser les cookies non essentiels ou de personnaliser les catégories.', 'Vos préférences sont enregistrées et peuvent être modifiées à tout moment.'] },
      { heading: '4. Cookies tiers', bullets: ['Des fournisseurs d’analytics, plateformes vidéo, widgets sociaux et réseaux publicitaires peuvent déposer leurs propres cookies.', 'WCM ne contrôle pas le comportement de ces cookies ; consultez la politique de confidentialité de chaque fournisseur.'] },
      { heading: '5. Gérer ou désactiver les cookies', bullets: ['Utilisez la bannière ou le panneau de réglages de WCM pour gérer les cookies non essentiels.', 'Votre navigateur peut bloquer ou supprimer les cookies, y compris les cookies tiers, et effacer les données de navigation.', 'Des outils d’opposition sont disponibles auprès de certains fournisseurs, tels que Google Analytics et Meta. La désactivation de tous les cookies peut limiter certaines fonctionnalités.'] },
      { heading: '6. Données stockées', bullets: ['Les cookies peuvent stocker des identifiants de session, le type d’appareil et de navigateur, une adresse IP anonymisée lorsque possible, l’historique de navigation et les interactions publicitaires.', 'Ils ne stockent pas vos mots de passe, vos informations de paiement ni vos données personnelles sensibles.'] },
      { heading: '7. Modifications', bullets: ['WCM peut mettre à jour cette Politique. Nous vous invitons à la consulter régulièrement ; toute version actualisée indique sa date de mise à jour.'] },
      { heading: '8. Contact', bullets: ['Pour toute question relative aux cookies : contact@worldculturemarketplace.com. World Culture Marketplace (WCM), 50 Avenue des Champs-Élysées, 75008 Paris, France ; Washington, USA.'] },
    ],
  }),
});
