# Az alkalmazás leírása

## Célja:

A honlap célja az, hogy azok, akik olyan DOS-os játékokkal szeretnének játszani – vagy gyűjtőként egy-egy kópiát szeretne beszerezni –, viszont nem akarnak kétes oldalakról, vagy Facebook Marketplaceról vásárolni, legyen egy megbízható felület, ahol beszerezhetik, vagy akár el is adhatják játékaikat.

A felhasználónak nem kell meghirdetnie a termékeit, egyeztetni a vevővel, illetve nem kell tartania attól, hogy a megvásárolt termék hibás, vagy esetleg meg sem érkezik egy-egy internetes megbeszélés után.

Az oldal adminisztrátorai képzett szakemberek, akik bevizsgálnak minden terméket, az esetleg hibákat feltüntetik, illetve a különlegességeket – például dedikált, vagy díszdobozos játékokat – megfelelően beárazzák.

## Technikai követelmények:

Angular alapú,
A dizájn Bootstrappel és SCSS-el készült el,
MongoDB, NoSQL,
NodeJS API szolgálja ki a frontendet,
Az api útvonalakhoz unit teszt kapcsolódik,
Az API-hoz Swagger dokumentáció van,
JWT autentikáció van a belépésnél,
Az alkalmazás dockerizálva van, konténerből futtatható,
Az egyes oldalak között fejléc segít váltani,
Responsive a megjelenés

**Az alkalmazás telepítése:**

Forkolni kell az adott GitHub repository tartalmát:
(https://github.com/Strukturavaltas-FullstackAPI-2023/fsapi-remek-assignment-szilavi)

A célgépre kell klónozni a repository tartalmát:
(git clone <https://github.com/Strukturavaltas-FullstackAPI-2023/fsapi-remek-assignment-szilavi.git>)

Telepíteni kell az alkalmazás függőségeit:
Backend: a terminálon be kell lépni a /backend mappába és futtatni az **npm i** parancsot
Frontend: A terminálba be kell lépni a /frontend mappába és futtatni az **npm i** parancsot

Ha még nincsen fenn a célgépen, akkor telepíteni kell az Angular keretrendszert, az **npm i -g @angular/cli** paranccsal.

Továbbra is a /frontend-ben, a terminálban ki kell adni az **ng build** parancsot

**Az alkalmazás indítása:**

A terminálban be kell lépni a /backend mappába és beírni, hogy **npm run start**, vagy az **mpm run start_nodemon**.

**Altetnatív megoldásként Dockerrel is lehet indítani:**

A megadott Docker container indítása és inicializálása:

Ehhez el kell indítani a Docker Desktop alkalmazást.
A /backend mappába belépve a terminálban ki kell adni a **npm run docker:compose** parancsot.

Miután megnyitottuk böngészőből az oldalt (az **npm run start** esetén a http://localhost:8080/-on, a **Dockerel** való indítás esetén a http://localhost:3000/-en), be kell jelentkeznünk.

A belépéshez egy érvényes USER e-mail-cím és jelszó páros (példa):

**E-mail:** szilagyi.viktor89@gmail.com

**Jelszó:** testtestQW12

A belépéshez egy érvényes ADMIN e-mail-cím és jelszó páros (példa):

**E-mail:** dosdepotbcs@gmail.com

**Jelszó:** DOSBekescsaba12

## A végpontok dokumentációja

### Swagger

Az alábbi URL-t kell beírni a böngészőbe: <http://localhost:8080/api/api-docs/>

_Megjegyzés: a Docker használata esetén a <http://localhost:3000/api/api-docs/>-on lehet elérni a Swaggert._

### További fejlesztési lehetőségek:

Az oldal népszerűségével lapozók beállítása, illetve, ha túl sok új játékkal bővülne az adatbázis, akkor azok szerkesztése adminisztrátor által (kiadás éve, rövid leírás).

Ezek mellett, ha megszaporodnak az ajánlatok és a kívánságlisták, azokat nem feltétlen kell nevekhez kötni, később pusztán azt is meg lehet jeleníteni, hogy hány ember szeretné a kívánt játékot megvásárolni.

## A honlap főbb részei:

1. [Navbár](#navbár)
2. [Főoldal](#főoldal)
3. [Login](#login)
4. [Store](#store)
5. [More info page](#more-info-page)
6. [Buy page](#buy-page)
7. [About Us](#about-us)
8. [Admin Page](#admin-page)
9. [Take offer page](#Take-offer-page)
10. [Wishlist](#wishlist)
11. [Edit user (admin only)](#edit-user-admin-only)
12. [Add game to the store](#add-game-to-the-store)

## Navbár

komponens neve: navbar

komponens helye: common/navbar

A navbar segítségével lehet váltogatni az oldalakon.
Ha nincs a user bejelentkezve, akkor egy „Welcome!”, illetve a „Sign in / Sign up” oldalra tud csak navigálni.

A „Welcome!”a home oldalra navigál, a „Sign in / Sign up” pedig a loginra-ra.

**Bejelentkezve userként:**

- **Store:** a Store-ra vezet.
- **About Us:** az About Us oldalra vezet.
- **Hello _User_!:** Ráhúzva a kurzort három aloldalt jelenít meg:
- **Edit Pofil:** Edit-user oldalra navigál.
- **I have an offer!:** takeoffer oldalra navigál.
- **Wishlist:** wishlistre navigál.
- **Logout:** kilépteti a usert/adminisztrátort

**Bejelentkezve adminisztrátorként:**

- **Store:** a Store-ra vezet.
- **About Us:** az About Us oldalra vezet.
- **Admin page:** Rákattintva az admin oldalra vezet. Ráhúzva az egeret viszont a következő oldalakra lehet navigálni:
- **Add game to the store:** takeoffer oldalra vezet.
- **Edit user:** user-editor oldalra vezet.
- **Hello _User_!:** Ráhúzva a kurzort három aloldalt jelenít meg:
- **Edit Pofil:** Edit-user oldalra navigál.
- **Logout:** kilépteti a usert/adminisztrátort

## Főoldal

komponens neve: home

komponens helye: page/home

Egy jumbotron jelenik meg, ami köszönti a felhasználót, majd opcionálisan lehetőséget kap arra, hogy jelentkezzen be, vagy regisztráljon.
_Megjegyzés: ez a gomb nincsen ott, ha a felhasználó be van regisztrálva._

## Login

komponens neve: login

komponens helye: page/login

Megnyitva az oldalt háromdolgot tehetünk:

Ha már regisztráltunk, akkor e-mail címünk és jelszavunkat beírva beléphetünk.
Ha elfelejtettük a jelszavunkat, akkor jelezhetjük ezt a „Forgot your password?” gombra kattintva.

A „Sign Up”gomb segítségével regisztrálhatjuk magunkat.

## Store

komponens neve: store

komponens helye: page/store

Az oldalon egy táblázat található, ami kiírja az eladó játék címét, a boltot, ahol átvehető, illetve az árát.
A két gomb közül az első a More info oldalra vezet, a másik pedig a Buy page-re irányít.

## More info page

komponens neve: more info

komponens helye: page/more-info

Az oldalt megnyitva láthatjuk a játék címét és leírását, valamint az árát és ha meg van adva egy condition, akkor pirossal kiemelve megjeleníti.
Ezen kívül egy „Buy now!”gomb is megtalálható, ami a buy oldalra vezet.

## Buy page

komponens neve: buy

komponens helye: page/buy-now

Az oldal bal oldalán megjelenik a bolt leírása (elérhetőség, telefonszám, email), felette a játék ára, amit ki kell fizetnünk.
A jobb oldalon a belépett felhasználó adatai láthatók, utolsó sorban a kártyaszám, aminek utolsó négy karaktere látszik csak.

A megerősítéshez alul egy újabb piros „Buy NOW!” gomb van, aminek segítségével véglegesíthetjük vásárlásunkat.

## About Us

komponens neve: aboutus

komponens helye: page/aboutus

Az oldalon egy jumbotron látható egy kiegészített, részletes leírással a weboldalról és annak üzemeltetőiről.

## Admin page

komponens neve: admin

komponens helye: page/ admin

Az oldal elzárva van azoktól, akik nem adminisztrátorok.
Az oldal bal oldalán a kívánságlisták találhatóak, aminek segítségével az adminisztrátor láthatja, hogy mire van igénye a usereknek.
Az oldal jobb oldalán a userek aktuális ajánlatai láthatóak, a „more info” gomb pedig a more-info oldalra vezet.

## Take offer page

komponens neve: takeoffer

komponens helye: page/ takeoffer

Az oldalon egy jumbotron leírja az oldal működését.
Alatta egy kereső van, amibe beírva a játék nevét, kiadja a játékot, ha azt tartalmazza az adatbázis, akkor ráklikkelhet, a lenyíló fülön pedig megtalálja a játék leírását, ha pedig szeretne egy condition-t és egy árat írni, akkor megteheti. A „Take offer!”, amivel véglegesíthetjük az ajánlatunkat.
Ha a játék nincs benne az adatbázisba, akkor az „I want to add a new game!”-re kattintva – ami mindig megjelenik, ha keresünk – a „title” kitöltésével ugyanerre az eredményre jutunk.

A korábbi ajánlataink az oldal alján lévő „Your actual offers” alatt található, tábálázat formájában.
Az ajánlatokat a „Delete” gomb megnyomásával lehet kitörölni.

## Edit Pofil

komponens neve: edit-user

komponens helye: page/edit-user

Az oldalra kattintva a user az ID-jén kívül minden adatot módosíthat, majd, ha a jelszavát beírja, akkor az „Edit user data” gombra kattintva elmenti a változásokat.

## Wishlist

komponens neve: wishlist

komponens helye: page/ wishlist

Az oldalon egy jumbotron leírja az oldal működését.
Alatta egy kereső van, amibe beírva a játék nevét, kiadja a játékot, ha azt tartalmazza az adatbázis, akkor ráklikkelhet, a lenyíló fülön pedig megtalálja a játék leírását. A „Add to my wishlist!”, amivel felrakhatjuk a játékot a wishlist-ünkre.
Ha a játék nincs benne az adatbázisba, akkor az „I want to add a new game!”-re kattintva – ami mindig megjelenik, ha keresünk – a „title” kitöltésével ugyanerre az eredményre jutunk.
A wishlist-ünk a „Your wishlist” alatt található, tábálázat formájában.
Az játékokat a „Delete” gomb megnyomásával lehet kitörölni.

## Edit user (admin only)

komponens neve: user-editor

komponens helye: page/admin/user-editor

_Az oldal elzárva van azoktól, akik nem adminisztrátorok._
Az oldalon egy táblázat jelenik meg, ami a usereket sorolja fel. Fontosabb információk itt is megtekinthetőek:

név, e-mail, telefonszám.

A „more info” gomb az edit-user oldalra vezet, ahol az admin törölheti a usert, annak minden adatával, wishlistjével és ajánlataival.

## Add game to the store

komponens neve: takeoffer

komponens helye: page/ takeoffer

A takeoffer oldalra vezet.
_Megjegyzés: mivel itt egy user ad egy ajánlatot, természetesen megjelenik a „Store” oldalon_
