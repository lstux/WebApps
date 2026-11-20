# Synchroniser une webapp avec `store.lslinux.org` (PocketBase)

Doc à donner à la conversation qui développe les webapps (Slovingo, MathPulse, WebApps…). Elle décrit le serveur, son modèle de données, et le module client `pbstore.js` (fourni avec ce fichier : à copier tel quel dans chaque app).

## Objectif

Les apps gardent **localStorage comme source de vérité locale** (elles marchent sans compte, sans réseau). En option, dans les réglages, l'utilisateur saisit **URL + email + mot de passe** : les données sont alors aussi copiées sur PocketBase pour être retrouvées sur ses autres appareils. Sans réglage, rien ne change.

## Le serveur

- URL : `https://store.lslinux.org` (PocketBase 0.40, derrière nginx, TLS). Admin : `/_/` (réservé à Eric).
- **CORS ouvert** (`*`) : les apps sur `https://<site>.lslinux.org` (ou ailleurs) peuvent l'appeler directement avec `fetch`. L'authentification passe par l'en-tête `Authorization`, pas par des cookies.
- **Pas d'inscription publique** : les comptes sont créés par Eric dans l'admin. L'app n'a donc pas d'écran « créer un compte », seulement « se connecter ».
- Une seule collection générique **`kv`**, un utilisateur ne voit et ne modifie que ses lignes :

| champ | type | remarque |
|---|---|---|
| `owner` | relation `users` | l'utilisateur connecté (à fournir à la création) |
| `app` | texte | `[a-z0-9][a-z0-9_-]*`, 64 car. max : `slovingo`, `mathpulse`, `webapps`… |
| `key` | texte | 255 car. max : l'équivalent de la clé localStorage |
| `value` | JSON | 5 Mo max ; **`null` = clé supprimée** (pierre tombale) |
| `created`, `updated` | date | gérés par le serveur ; `updated` sert à la fusion |

Unicité sur `(owner, app, key)` : un doublon est refusé (400).

## API REST utilisée (si tu n'utilises pas `pbstore.js`)

```
POST   /api/collections/users/auth-with-password   {"identity","password"} -> {token, record:{id,email}}
POST   /api/collections/users/auth-refresh         (Authorization: <token>) -> {token, record}
GET    /api/collections/kv/records?perPage=200&filter=app='slovingo'
GET    /api/collections/kv/records?perPage=1&filter=app='slovingo' && key='progress'
POST   /api/collections/kv/records                 {"owner":<id>,"app","key","value"}
PATCH  /api/collections/kv/records/<id>            {"value": ...}
DELETE /api/collections/kv/records/<id>
```

L'en-tête est `Authorization: <token>` (**sans** préfixe `Bearer`). Les quotes et antislashs d'une clé dans `filter` doivent être échappés.

**Limites de débit** (par IP) : l'authentification est limitée à **2 requêtes par 3 s** (429 au-delà), la création à 20 par 5 s, le reste à 300 par 10 s. Donc : un seul `login` par action de l'utilisateur, jamais en boucle ; ne pas se reconnecter à chaque synchro (le jeton est conservé et rafraîchi).

## Le module `pbstore.js`

Module sans dépendance. Fichier : `code/pbstore.js` (version « script classique » du `pbstore.js` d'origine : même code, sans `export`, définit `window.PBStore`) (testé avec Node 26 contre PocketBase 0.40.6 : deux appareils simulés, mises à jour, suppressions, isolation entre apps).

```js
// <script src="pbstore.js"></script>   (dans <head>, comme common.js ; marche en file://)

const store = new PBStore({ app: "slovingo", prefix: "slovingo." });
// app    : nom de l'app côté serveur (champ `app` de kv)
// prefix : préfixe des clés localStorage de l'app (optionnel). store.get("x") lit localStorage["slovingo.x"]

// 1. Écran de réglages : connexion (le mot de passe n'est jamais stocké, seulement le jeton)
await store.login("https://store.lslinux.org", email, motDePasse);
store.logout();
store.connected;   // bool ; store.email ; store.url

// 2. Au quotidien : lecture/écriture locales synchrones, copie distante en arrière-plan (délai 1,5 s)
store.set("progress", { level: 3 });
store.get("progress");        // -> { level: 3 } (JSON.parse, sinon la chaîne brute)
store.remove("progress");     // propagée aux autres appareils ; set(key, null) fait pareil

// 3. Synchronisation : au démarrage de l'app, à l'événement "online", après la connexion
store.adopt(["progress", "settings"]);   // UNE fois, avant la 1re synchro, pour les clés déjà en localStorage
const { pushed, pulled } = await store.sync();
store.onChange = (key, value) => { /* valeur remplacée par la version distante : rafraîchir l'UI ; value null = supprimée */ };
store.onError  = (e) => { /* sinon console.warn ; e.status = code HTTP */ };
```

### Règles de fusion

- **Dernière écriture gagne, par clé** : horodatage local (`Date.now()` à chaque `set`/`remove`) contre `updated` du serveur. Les horloges des appareils doivent donc être à peu près justes.
- `sync()` pousse les clés plus récentes en local, rapatrie celles plus récentes sur le serveur, applique les suppressions. Les clés ne sont suivies que si elles passent par `store.set/remove` (ou `adopt`).
- **`adopt(keys)`** : pour les données qui existaient avant la synchro. Elles sont envoyées si le serveur ne les a pas, mais **la version du serveur gagne en cas de conflit** (donc un second appareil avec des données locales différentes les perd au premier `sync`). À signaler à l'utilisateur dans l'écran de réglages si l'app le justifie.
- Le jeton est rafraîchi à chaque `sync()`. Si le serveur répond 401/403, le module se déconnecte (`connected` devient faux) : redemander le mot de passe.

## Dans ce dépôt

- `code/pbstore.js` : le module (script classique).
- `code/pbsync.js` : l'écran « Synchronisation » partagé (connexion, état, synchro à l'ouverture / au retour en ligne / au retour d'onglet, au plus toutes les 20 s) : `PBSync.init(pb, { adopt, note, onChange, onStatus })` puis `sync.open()` depuis un menu.
- **Connexion partagée** : `new PBStore({ app, sharedAuth: true })` garde le jeton sous la clé `pbstore:auth`, commune à toutes les apps de la même origine (même navigateur, même site) : un seul login pour toutes. Se connecter ou se déconnecter dans l'une vaut pour les autres à leur prochaine synchro ou ouverture. Une connexion déjà faite sous la clé propre à l'app est reprise. Une autre origine (par exemple un autre site) demande sa propre connexion.
- Utilisé par TODO (`app: todo`, clé `todo-tree-v1`), la Liseuse (`app: liseuse`, clé `favs`) et ProtoBoardDesigner (`app: protoboard`).

## Conseils d'intégration

- **Ne rien casser sans réglage** : si `store.connected` est faux, `set`/`get` se comportent comme localStorage, `sync()` ne fait rien.
- Remplacer les `localStorage.getItem/setItem` de l'app par `store.get/set` (une seule couche, c'est ce qui permet le suivi des clés). Les données volumineuses ou régénérables (caches, images) restent en localStorage seul : 5 Mo max par valeur et la limite de débit s'appliquent.
- Appeler `sync()` à l'ouverture, au retour en ligne (`window.addEventListener("online", ...)`) et éventuellement quand l'onglet redevient visible (`visibilitychange`), pas en boucle rapide.
- Un `onChange` doit relire l'état et redessiner l'UI, car une valeur peut être remplacée pendant que l'utilisateur joue.
- Plusieurs apps peuvent partager le même compte : l'isolation se fait par le champ `app` (un utilisateur de Slovingo ne touche pas les clés de MathPulse sauf bug de nom).
- Ne mets **jamais** de mot de passe ni de jeton dans le dépôt GitHub ou le code de l'app ; l'URL du serveur peut y figurer (`https://store.lslinux.org` est la valeur par défaut).

## Test rapide depuis la console du navigateur

```js
const s = new PBStore({ app: "essai" });   // dans une page qui charge pbstore.js
await s.login("https://store.lslinux.org", "mon@email", "monmotdepasse");
s.set("hello", { a: 1 }); await s.sync();
// ouvrir l'admin /_/ -> collection kv : la ligne (app=essai, key=hello) doit apparaître
```

## Ce qu'il ne faut pas faire croire à l'utilisateur

- Ce n'est **pas** un chiffrement de bout en bout : les valeurs sont lisibles par l'administrateur du serveur.
- Ce n'est **pas** de la collaboration : un compte = un jeu de données, la dernière écriture gagne par clé.