import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MentionsLegales = () => {
  return (
    <>
      <Navbar />
      <div className="main">
        <div className="col-2">
          <div className="content">
            <h1 style={{ fontSize: "50px", marginBottom: "2rem", marginTop: "5rem", fontFamily: "-apple-system", alignItems: "center" }}>Mentions légales</h1>
            <div className="card" style={{ fontFamily: "sans-serif", marginBottom: "10rem", fontSize: "20px", textAlign: "justify" }}>
              <div style={{marginTop:"2rem"}}>
                Conformément aux dispositions de la loi n° 2004-575 du 21 juin
                2004 pour la confiance en l'économie numérique, il est précisé aux
                utilisateurs du site Thétiptop l'identité des différents
                intervenants dans le cadre de sa réalisation et de son suivi.
              </div>
              <br></br>
              <h3>Edition du site</h3>
              <div>
                Le présent site, accessible à l’URL
                dsp5-archiwebo22b-mz-bh-rz-mk.fr (le « Site »), est édité par :
                FuriousDucks(dsp5-groupe7-archiweb-o22b).
              </div>
              <br></br>
              <h3>Informations sur l’entreprise</h3>
              <div>
                <h4>Nom de l'entreprise :</h4>
                Thé Tip Top
                <h4>Statut juridique :</h4>
                Société Anonyme (SA)
                <h4>Adresse du siège social :</h4>
                18 rue Léon Frot, 75011 Paris
                <h4>Numéro de téléphone :</h4>
                +33 6 12 34 56 78
                <h4>Adresse e-mail :</h4>
                contact@thetiptop.fr
                <h4>Capital social :</h4>
                150 000 euros
                <h4>Numéro RCS :</h4>
                RCS PARIS B 517 403 572
                <h4>Numéro SIRET :</h4>
                825 012 345 00027
                <h4>TVA intracommunautaire :</h4>
                FR 32 123456789
              </div>
              <br></br>
              <h3>Directeur de publication</h3>
              <div>Nom du responsable de la publication : Éric BOURDAN Fonction - Directeur Général</div>
              <br></br>
              <h3>Hébergement du site</h3>
              <div>
                Le Site est hébergé par la société Digital Ocean, situé PARIS.<br />
                Numéro de téléphone : +33 6 21 21 21 21.
              </div>
              <br></br>
              <h3>Nous contacter</h3>
              <div>
                Par téléphone : +33 6 21 21 31 31
                <br />
                Par email :  contact@thetiptop.fr
                <br />
                Par courrier : 18 rue Léon Frot, 75011 Paris
              </div>
              <br></br>
              <h3>Propriété intellectuelle</h3>
              <div>
                Le contenu du site (textes, images, vidéos, etc.) est protégé par le droit d'auteur et la propriété intellectuelle. Toute reproduction ou utilisation du contenu sans autorisation est strictement interdite.
              </div>
              <br></br>
              <h3>Données personnelles</h3>
              <div>
                Le site collecte et traite des données personnelles des utilisateurs (nom, prénom, adresse, e-mail, etc.) conformément aux dispositions de la loi n°78 - 17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés. Les utilisateurs ont un droit d'accès, de rectification et de suppression des données les concernant en envoyant un e-mail à l'adresse contact@thetiptop.fr.<br />
                Le traitement de vos données à caractère personnel est régi par
                notre Charte du respect de la vie privée, disponible depuis la
                section "Charte de Protection des Données Personnelles",
                conformément au Règlement Général sur la Protection des Données
                2016/679 du 27 avril 2016 «RGPD».
              </div>
              <br></br>
              <h3>Cookies</h3>
              <div>
                Le site utilise des cookies pour améliorer l'expérience utilisateur et collecter des données statistiques. Les utilisateurs peuvent désactiver les cookies en modifiant les paramètres de leur navigateur.
              </div>
              <br></br>
              <h3>Liens hypertextes</h3>
              <div>
                Le site peut contenir des liens hypertextes vers des sites tiers. Thé Tip Top ne peut être tenu responsable du contenu de ces sites.
              </div>
              <br></br>
              <h3>Droit applicable et juridiction complète</h3>
              <div style={{marginBottom:"2rem"}}>
                Le site et son contenu sont soumis au droit français. Tout litige relatif au site sera de la compétence exclusive des tribunaux français.
              </div>
            </div>
          </div>
        </div>
        </div>
      <Footer />
    </>
  );
};

export default MentionsLegales;
