# Convertisseur — unités et devises

Une page unique pour convertir des unités courantes et des devises, sans serveur.

## Caractéristiques

- **10 catégories d'unités** : longueur, masse, volume, surface, température, vitesse, temps, données (décimal Ko/Mo et binaire Kio/Mio), énergie, pression.
- **Devises** : taux récupérés en ligne, avec repli automatique d'une source sur l'autre.
- **Toutes les conversions d'un coup** : la liste du bas affiche la valeur dans chaque unité de la catégorie ; un clic sur une ligne la choisit comme unité d'arrivée.
- **Saisie souple** : la virgule ou le point décimal, les espaces et la notation `1e3` sont acceptés.
- **Inversion réversible** : ⇅ échange les unités et reprend le résultat comme nouvelle valeur.
- **Mémoire** : dernière catégorie, dernière valeur et dernières unités par catégorie, dans `localStorage`.
- **Thème** : s'adapte au mode clair/sombre du système. Mobile-first.

## Devises

| Source | URL | Remarque |
|--------|-----|----------|
| Frankfurter (BCE) | `https://api.frankfurter.dev/v1/latest?base=EUR` | essayée en premier ; taux de la BCE, publiés les jours ouvrés |
| open.er-api.com | `https://open.er-api.com/v6/latest/EUR` | repli ; plus de devises |

Comportement :

1. Au chargement, les taux sont lus depuis le cache local s'ils ont moins de 24 h, sinon récupérés en ligne.
2. Si les deux sources échouent, le **dernier taux connu** est utilisé et la page l'indique avec sa date (« Hors ligne »).
3. Sans cache ni réseau, la catégorie Devises affiche un message ; les autres catégories restent utilisables.
4. Le bouton **Actualiser** force une nouvelle récupération.

Les taux sont indicatifs (taux de référence, pas taux bancaires) : ne pas s'en servir pour une transaction.

Les deux API sont gratuites et sans clé, mais rien ne garantit leur disponibilité à long terme. Si l'une disparaît, il suffit d'ajuster le tableau `SOURCES` en tête du bloc « Devises » du script (une URL et une fonction `parse` qui renvoie `{date, rates}` avec l'euro pour base).

## Ajouter une unité

Dans `CATS`, ajouter une ligne `L(id, nom, symbole, facteur)` où le facteur convertit vers l'unité de base de la catégorie (mètre, kilogramme, litre, etc.). Pour une conversion non linéaire, fournir les fonctions `to` et `from` comme pour les températures.

## Données

Seuls les derniers taux et vos réglages sont stockés dans le navigateur. Aucune valeur saisie n'est envoyée ; les appels réseau ne concernent que la récupération des taux.
