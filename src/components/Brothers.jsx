import { useState, useEffect } from 'react';
import './Brothers.css';

// ─────────────────────────────────────────────
// 🔧 GOOGLE SHEETS CONFIG
// 1. Share your sheet: Share → Anyone with link → Viewer
// 2. Paste your Sheet ID below (the long string in the URL)
// Sheet columns: A=Class, B=Bond#, C=Name, D=Nickname
// ─────────────────────────────────────────────
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

const CLASS_NAMES = {
  'Founding Fathers': 'Founding Fathers — Est. March 1st 2000',
  Charter:            'Charter Class',
  Omega:              'This page is dedicated to our fallen Brhothers.  We miss y\’all. \n We\'ll see you when we get there. Forever Blue and Gold, Forever Strong and Bold.',
  Alpha:              'Alpha Class',
  Beta:               'Beta Klass',
  Gamma:              'Gamma Class',
  Delta:              'Delta Class',
  Epsilon:            'Epsilon Class',
  Zeta:               'Zeta Class',
  Eta:                'Eta Class',
  Theta:              'Theta Class',
  Iota:               'Iota Class',
  Kappa:              'Klowns',
  Lambda:             'Lambda Class',
  Mu:                 'Mu Class',
  Nu:                 'Era',
  Xi:                 'Xiyonara Ximurai',
  Omicron:            'Overtimers',
  Pi:                 'Bakers',
  Rho:                'Rhobots',
  Sigma:              'Swagger',
  Tau:                'Tau Class',
  Upsilon:            'Upsilon Class',
  Phi:                'Phi Class',
  Chi:                'X-MEN',
  Psi:                'PSICHOs',
  'Alpha Alpha':      'Aces',
  'Alpha Beta':       'Killers',
  'Alpha Gamma':      'Goonz',
  'Alpha Delta':      'Demons',
  'Alpha Epsilon':    'Emanons',
  'Alpha Zeta':       'Zombies',
  'Alpha Eta':        "HBK's",
  'Alpha Theta':      'Thieves',
  'Alpha Iota':       'Imperials',
  'Alpha Kappa':      "47's",
  'Alpha Lambda':     'LunAHtik$',
  'Alpha Mu':         'MON$TARZ',
  'Alpha Nu':         'NIGHTM4RES',
  'Alpha Xi':         'eXiles',
  'Alpha Omicron':    'OUTΛAWZ',
  'Alpha Pi':         'PHANTOMS',
  'Alpha Rho':        'RA!D6R$',
  'Alpha Sigma':      'SOULJA$',
  'Alpha Tau':        'TRO∐B13MAKΞRS',
  'Alpha Upsilon':    'Y$URnER$',
  'Alpha Phi':        'PLAY3RΣ',
};

// Greek letter order for sorting
const CLASS_ORDER = Object.keys(CLASS_NAMES);

// ─────────────────────────────────────────────
// FULL BROTHER ROSTER — from your spreadsheet
// status: 'Active' for current brothers, 'Alumni' for graduated
// crossed: semester they crossed
// ─────────────────────────────────────────────
const ALL_BROTHERS = [
  // Founding Fathers — Spring 2000
  { bondNo:1,  name:'Jason Valoroso',       nickname:'The Doggfather',                    pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:2,  name:'Kenny Fong',            nickname:'Special K',                         pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:3,  name:'James Kuniyoshi',       nickname:'The Answer',                        pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:4,  name:'Jeremy Quirante',       nickname:'MIA',                               pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:5,  name:'Jay Balanay',           nickname:'Bling',                             pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:6,  name:'Kenny Ortega',          nickname:'Keno Sabe',                         pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:7,  name:'Fredrick Lucina Jr.',   nickname:'Ryan',                              pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:8,  name:'Reuel Andaya',          nickname:'DJReustr',                          pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:9,  name:'Anthony Gambol',        nickname:'Twon',                              pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },
  { bondNo:10, name:'Benjamin Abiva',        nickname:'Benzeeto',                          pledgeClass:'Founding Fathers', crossed:'Spring 2000', status:'Alumni' },

  // Charter — Fall 2000
  { bondNo:11, name:'Leo Madrid',            nickname:'Caesar',                            pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:12, name:'Rennie Tomimbang',      nickname:'Rendeezy off the Heezy',            pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:13, name:'Dan Taylor',            nickname:'The Man',                           pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:14, name:'Reginald Mose',         nickname:'Roscoe',                            pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:15, name:'Donny Nguyen',          nickname:'The Numba One Stunna',              pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:16, name:'Jeff Abalos',           nickname:'Steel',                             pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:17, name:'Arvinn Iglesia',        nickname:'The Kingpin',                       pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:18, name:'Art Tejada Jr.',        nickname:'Artimus Maximus',                   pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:19, name:'Vernon Mena Jr.',       nickname:'The Infamous Madman',               pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },
  { bondNo:20, name:'James Metz',            nickname:'Big Tymer',                         pledgeClass:'Charter', crossed:'Fall 2000', status:'Alumni' },

  // Omega Class — in memoriam
  { bondNo: '41A', name: 'Andy Lee',      pledgeClass: 'Omega', minimal: true },
  { bondNo: '26Γ', name: 'Jeremy Pallon', pledgeClass: 'Omega', minimal: true },

  // Alpha — Spring 2001
  { bondNo:21, name:'Randall Vallejos',      nickname:'ROC',                               pledgeClass:'Alpha', crossed:'Spring 2001', status:'Alumni' },
  { bondNo:22, name:'Mikey Mike Andres',     nickname:'The Big Fish',                      pledgeClass:'Alpha', crossed:'Spring 2001', status:'Alumni' },

  // Beta — Fall 2001
  { bondNo:23, name:'Michael Tran',          nickname:'Mouzer',                            pledgeClass:'Beta', crossed:'Fall 2001', status:'Alumni' },
  { bondNo:24, name:'Joe Javien',            nickname:'The Game',                          pledgeClass:'Beta', crossed:'Fall 2001', status:'Alumni' },
  { bondNo:25, name:'Billie Sayavong',       nickname:'Ho',                                pledgeClass:'Beta', crossed:'Fall 2001', status:'Alumni' },
  { bondNo:26, name:'Alan Leung',            nickname:'Blinkin',                           pledgeClass:'Beta', crossed:'Fall 2001', status:'Alumni' },
  { bondNo:27, name:'Jason Lee',             nickname:'Chewy',                             pledgeClass:'Beta', crossed:'Fall 2001', status:'Alumni' },
  { bondNo:28, name:'David Eng',             nickname:'Potter',                            pledgeClass:'Beta', crossed:'Fall 2001', status:'Alumni' },
  { bondNo:29, name:'TJ Martin',             nickname:"Kap'n Krunch",                      pledgeClass:'Beta', crossed:'Fall 2001', status:'Alumni' },

  // Gamma — Spring 2002
  { bondNo:30, name:'Vinnie Pham',           nickname:'The Realest',                       pledgeClass:'Gamma', crossed:'Spring 2002', status:'Alumni' },
  { bondNo:31, name:'Chris Abad',            nickname:'Oreo',                              pledgeClass:'Gamma', crossed:'Spring 2002', status:'Alumni' },

  // Delta — Fall 2002
  { bondNo:32, name:'Jason Antonio',         nickname:'J-Solo',                            pledgeClass:'Delta', crossed:'Fall 2002', status:'Alumni' },

  // Epsilon — Spring 2003
  { bondNo:33, name:'George Wood',           nickname:'G-Suave',                           pledgeClass:'Epsilon', crossed:'Spring 2003', status:'Alumni' },
  { bondNo:34, name:'Justin Backley',        nickname:'Just Blaze',                        pledgeClass:'Epsilon', crossed:'Spring 2003', status:'Alumni' },
  { bondNo:35, name:'Mark Aranzanso',        nickname:'Smokey',                            pledgeClass:'Epsilon', crossed:'Spring 2003', status:'Alumni' },

  // Zeta — Fall 2003
  { bondNo:36, name:'Kevin Long',            nickname:'Izzy',                              pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:37, name:'JP Casabar',            nickname:'The Professional',                  pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:38, name:'Leo Alo',               nickname:'Halo',                              pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:39, name:'Derrick Dare',          nickname:'D-Trick',                           pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:40, name:'Jay Josue',             nickname:'Shakes',                            pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:41, name:'Andy Lee',              nickname:'Dub Sauce',                         pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:42, name:'Guillermo Sifuentes Jr.',nickname:'G-Mo',                             pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:43, name:'Hiro Sato',             nickname:'The Napster',                       pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:44, name:'Marvill Quiambao',      nickname:'Grumpy',                            pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },
  { bondNo:45, name:'Brian Le',              nickname:'Trips',                             pledgeClass:'Zeta', crossed:'Fall 2003', status:'Alumni' },

  // Eta — Spring 2004
  { bondNo:46, name:'Howard Tu',             nickname:'Yonex',                             pledgeClass:'Eta', crossed:'Spring 2004', status:'Alumni' },
  { bondNo:48, name:'Christian Tampueco',    nickname:'Soul Child',                        pledgeClass:'Eta', crossed:'Spring 2004', status:'Alumni' },
  { bondNo:49, name:'Robin Tabana',          nickname:'Barbershop',                        pledgeClass:'Eta', crossed:'Spring 2004', status:'Alumni' },

  // Theta — Fall 2004
  { bondNo:50, name:'Kenneth Jamison',       nickname:'Braveheart',                        pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },
  { bondNo:51, name:'Christian Pontiga',     nickname:'Showtime',                          pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },
  { bondNo:52, name:'William Truong',        nickname:'Yayo',                              pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },
  { bondNo:53, name:'Jonathan Rejada',       nickname:'Boner',                             pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },
  { bondNo:54, name:'Jason Nguyen',          nickname:'A-Tray',                            pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },
  { bondNo:55, name:'Jesse Yanogacio',       nickname:'Smiley',                            pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },
  { bondNo:56, name:'Kenichi Yamauchi',      nickname:'Ichiban',                           pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },
  { bondNo:57, name:'Nelson Robeniol',       nickname:'Da Bully',                          pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },
  { bondNo:58, name:'Brannon Plandor',       nickname:'B',                                 pledgeClass:'Theta', crossed:'Fall 2004', status:'Alumni' },

  // Iota — Spring 2005
  { bondNo:59, name:'James Rimando',         nickname:'TI',                                pledgeClass:'Iota', crossed:'Spring 2005', status:'Alumni' },
  { bondNo:60, name:'William Apa',           nickname:'Usher',                             pledgeClass:'Iota', crossed:'Spring 2005', status:'Alumni' },
  { bondNo:61, name:'Marlon Olegario',       nickname:'Baby',                              pledgeClass:'Iota', crossed:'Spring 2005', status:'Alumni' },
  { bondNo:62, name:'Abe Yuen',              nickname:'The Hulk',                          pledgeClass:'Iota', crossed:'Spring 2005', status:'Alumni' },
  { bondNo:63, name:'Art Menguita',          nickname:'Picasso',                           pledgeClass:'Iota', crossed:'Spring 2005', status:'Alumni' },
  { bondNo:64, name:'Pablo Agrio',           nickname:'Shakespeare',                       pledgeClass:'Iota', crossed:'Spring 2005', status:'Alumni' },

  // Kappa — Fall 2005
  { bondNo:65, name:'John Bognot',           nickname:'Academy Awards',                    pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:66, name:'Ben Lee',               nickname:'Squirtle',                          pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:67, name:'Jack Ng',               nickname:'Shaggy',                            pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:68, name:'Michael Navales',       nickname:'Catastrophe',                       pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:69, name:'Chris Roldan',          nickname:'Hyphy',                             pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:70, name:'Erwin Buenavente',      nickname:'Ninja Turtle',                      pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:71, name:'Raynard Terrado',       nickname:'Alien Head',                        pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:72, name:'Keith Roa',             nickname:'Goomba',                            pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:73, name:'Vinh Nguyen',           nickname:'Big Sexy',                          pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:74, name:'JP Baluyot',            nickname:'T-Rex',                             pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:75, name:'Richard Delacruz',      nickname:'Alvin',                             pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:76, name:'Lenny Guanco',          nickname:'Dopey',                             pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },
  { bondNo:77, name:'Joshua Quiocho',        nickname:'One Man Show',                      pledgeClass:'Kappa', crossed:'Fall 2005', status:'Alumni' },

  // Lambda — Fall 2006
  { bondNo:78, name:'Justin Villanueva',     nickname:'Pretty Boy',                        pledgeClass:'Lambda', crossed:'Fall 2006', status:'Alumni' },
  { bondNo:79, name:'Robby Delgado',         nickname:'The Real Deal',                     pledgeClass:'Lambda', crossed:'Fall 2006', status:'Alumni' },
  { bondNo:80, name:'B.J. Gerona',           nickname:'Lucky Bounce',                      pledgeClass:'Lambda', crossed:'Fall 2006', status:'Alumni' },
  { bondNo:81, name:'Tlaloc Garcia',         nickname:'Monster',                           pledgeClass:'Lambda', crossed:'Fall 2006', status:'Alumni' },
  { bondNo:82, name:'Daniel Jung',           nickname:'San',                               pledgeClass:'Lambda', crossed:'Fall 2006', status:'Alumni' },
  { bondNo:83, name:'Darrell Balancio',      nickname:'Need 4 Speed',                      pledgeClass:'Lambda', crossed:'Fall 2006', status:'Alumni' },
  { bondNo:84, name:'Justin Nietes',         nickname:'Backdraft',                         pledgeClass:'Lambda', crossed:'Fall 2006', status:'Alumni' },
  { bondNo:85, name:'Carlo Lumbad',          nickname:'Da Illest',                         pledgeClass:'Lambda', crossed:'Fall 2006', status:'Alumni' },

  // Mu — Spring 2007
  { bondNo:86, name:'Jay Adriano',           nickname:'Bakes',                             pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },
  { bondNo:87, name:'Ray Ray Albano',        nickname:'Da Repeat',                         pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },
  { bondNo:88, name:'Bobby Palma Jr.',       nickname:'Fucking',                           pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },
  { bondNo:89, name:'Justin Enriquez',       nickname:'Fresh Prints',                      pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },
  { bondNo:90, name:'John Paredes',          nickname:'All Types Of',                      pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },
  { bondNo:91, name:'Tomas Yang',            nickname:'The Ying',                          pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },
  { bondNo:92, name:'Jason Ancheta',         nickname:'.50 Cal',                           pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },
  { bondNo:93, name:'Charlee Soumountha',    nickname:'Socratic Seshunz',                  pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },
  { bondNo:94, name:'Ralph Dimarucut',       nickname:'The Truth',                         pledgeClass:'Mu', crossed:'Spring 2007', status:'Alumni' },

  // Nu — Fall 2007
  { bondNo:95,  name:'Jerry Lu',             nickname:'Kermit',                            pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:96,  name:'Ryan Nguyen',          nickname:'B-Tray',                            pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:97,  name:'EJ Avena',             nickname:'Da Slowpoke',                       pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:99,  name:'Jonathan Dalupan',     nickname:'Cheezles',                          pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:100, name:'Tommy Sunarto',        nickname:'Gun',                               pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:101, name:'RJ Miyamoto',          nickname:'Sickwidit',                         pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:102, name:'Trian Cariaga',        nickname:'Too Hard',                          pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:103, name:'Lance Guerrero',       nickname:'Guerilla',                          pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:104, name:'Justin Calica',        nickname:'Weak in da Knees',                  pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:105, name:'Kyle Andrada',         nickname:'Sleepy',                            pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:106, name:'Scott Chen',           nickname:'Blackout',                          pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:107, name:'Michael Martinez',     nickname:'Motormouth / Diesel',               pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:108, name:'Jeffrey Sera',         nickname:'Kamikaze',                          pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },
  { bondNo:109, name:'Chris Alquizar',       nickname:'Air Stress',                        pledgeClass:'Nu', crossed:'Fall 2007', status:'Alumni' },

  // Xi — Spring 2008
  { bondNo:110, name:'Jonathan Miranda',     nickname:'Da Meteor',                         pledgeClass:'Xi', crossed:'Spring 2008', status:'Alumni' },
  { bondNo:111, name:'Andrew Vo',            nickname:'DREEZY / Dream Come True',          pledgeClass:'Xi', crossed:'Spring 2008', status:'Alumni' },
  { bondNo:112, name:'Taka Gordon',          nickname:'Ironman',                           pledgeClass:'Xi', crossed:'Spring 2008', status:'Alumni' },

  // Omicron — Fall 2008
  { bondNo:113, name:'Kevin Sarmiento',      nickname:'K.O.',                              pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },
  { bondNo:114, name:'Mike Martinez',        nickname:'The Real',                          pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },
  { bondNo:115, name:'Erick Badral',         nickname:'YAOch',                             pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },
  { bondNo:116, name:'Jason Vicente',        nickname:'Lil Weezy, the Juggernaut',         pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },
  { bondNo:117, name:'Kim Impreso',          nickname:'Hype',                              pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },
  { bondNo:118, name:'Vincent Chen',         nickname:'Tweaks',                            pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },
  { bondNo:119, name:'Nate Gepila',          nickname:'Bittersweet',                       pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },
  { bondNo:120, name:'David Tong',           nickname:'Tantrum / Double Time',             pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },
  { bondNo:121, name:'Matthew Bernabe',      nickname:'Full Tilt',                         pledgeClass:'Omicron', crossed:'Fall 2008', status:'Alumni' },

  // Pi — Fall 2009
  { bondNo:122, name:'Huy Truong',           nickname:'Bok',                               pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:123, name:'Devon Vo',             nickname:'24/7',                              pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:124, name:'Mark Simon',           nickname:'Churrrrrmander',                    pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:125, name:'Anthony Cortez',       nickname:'Alter Ego',                         pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:126, name:'Dariel Caguioa',       nickname:'Fall Out Boy',                      pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:127, name:'Noel Mandal',          nickname:'S.S. Gonzo',                        pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:128, name:'Joshua Cruz',          nickname:'De La Soul',                        pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:129, name:'Kevin Southammavong',  nickname:'Redman ! The Night Crawler',        pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:130, name:'Mikael Jerome Pusung', nickname:'The Prodigy',                       pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:131, name:'Kelly Ogawa',          nickname:'99 Problems',                       pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:132, name:'Van Do',               nickname:'Professor X',                       pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },
  { bondNo:134, name:'Daravan Rath',         nickname:'Dough Boy',                         pledgeClass:'Pi', crossed:'Fall 2009', status:'Alumni' },

  // Rho — Spring 2010
  { bondNo:135, name:'Binh Do',              nickname:'Scissor Hands',                     pledgeClass:'Rho', crossed:'Spring 2010', status:'Alumni' },
  { bondNo:136, name:'Gerald Mendoza',       nickname:'Free Willy',                        pledgeClass:'Rho', crossed:'Spring 2010', status:'Alumni' },
  { bondNo:137, name:'James Kim',            nickname:'Dummm Ditty Dum Dum Babba Babba Ba Ba', pledgeClass:'Rho', crossed:'Spring 2010', status:'Alumni' },
  { bondNo:138, name:'Jas Arandia',          nickname:'Money',                             pledgeClass:'Rho', crossed:'Spring 2010', status:'Alumni' },

  // Sigma — Fall 2010
  { bondNo:139, name:'Lon Esposo',           nickname:'DA AFAKASI',                        pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:140, name:'Carldee Soriano',      nickname:'Vader',                             pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:141, name:'Bakari Weaver',        nickname:'Superman / Super Undercover Brother Man', pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:142, name:'RJ Altares',           nickname:'N.W.A',                             pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:143, name:'Adrian Villamil',      nickname:'Da Cupid',                          pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:144, name:'Andre Edwards',        nickname:'Cake',                              pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:145, name:'Allen Padua',          nickname:'The Black Plague',                  pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:146, name:'Danny Nguyen',         nickname:"DMD (Da MothaF'ckn Dragon) / King of the Hill", pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:147, name:'Mark Bomediano',       nickname:'Resurrection',                      pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:148, name:'Benny Do',             nickname:'Cu Den',                            pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:149, name:'Dominic Camozzi',      nickname:'Ninja',                             pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:150, name:'Mikey O\'Brien',       nickname:'Wonka',                             pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:151, name:'Kevin Yim',            nickname:'The Dopest*Booty Dew',              pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:152, name:'Boris Hope',           nickname:'The Great White',                   pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:153, name:'Jeff Hovland',         nickname:'The Rock',                          pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:154, name:'Kent Vo',              nickname:'Do It / Roach Killa',               pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },
  { bondNo:155, name:'Jon Layno',            nickname:'Lightyear',                         pledgeClass:'Sigma', crossed:'Fall 2010', status:'Alumni' },

  // Tau — Spring 2011
  { bondNo:156, name:'Nathan Manglal-lan',   nickname:'Bunso',                             pledgeClass:'Tau', crossed:'Spring 2011', status:'Alumni' },
  { bondNo:157, name:'Rich Vitalich',        nickname:"N Thugg'N",                         pledgeClass:'Tau', crossed:'Spring 2011', status:'Alumni' },
  { bondNo:158, name:'Leke Esposo',          nickname:'Hawaiian Punch',                    pledgeClass:'Tau', crossed:'Spring 2011', status:'Alumni' },
  { bondNo:159, name:'Sam Lee',              nickname:'Mad Hatter',                        pledgeClass:'Tau', crossed:'Spring 2011', status:'Alumni' },
  { bondNo:160, name:'Geoff Odelson',        nickname:'Off Topic',                         pledgeClass:'Tau', crossed:'Spring 2011', status:'Alumni' },
  { bondNo:161, name:'Sergio Camacho',       nickname:'Swanger',                           pledgeClass:'Tau', crossed:'Spring 2011', status:'Alumni' },
  { bondNo:162, name:'Gael Ermac',           nickname:'THE R3DSHIRT',                      pledgeClass:'Tau', crossed:'Spring 2011', status:'Alumni' },

  // Upsilon — Fall 2011
  { bondNo:163, name:'Jacky Chu',            nickname:'The Shot Heard Around the World',   pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },
  { bondNo:164, name:'Christian Alquizar',   nickname:'The Crucifix',                      pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },
  { bondNo:165, name:'Nathan Tajalle',       nickname:'Swisha Sweet',                      pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },
  { bondNo:166, name:'Marc Ruaburo',         nickname:'HydRHO',                            pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },
  { bondNo:167, name:'Lorenzo Angara',       nickname:'Rubber Band Man',                   pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },
  { bondNo:168, name:'Matt Manglal-lan',     nickname:"Poppin' Tags",                      pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },
  { bondNo:169, name:'Ivan Lugo',            nickname:'Mudkip',                            pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },
  { bondNo:170, name:'David Turner',         nickname:'Two Face',                          pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },
  { bondNo:171, name:'Brandon Kwong',        nickname:'Phoenix River / Q&A',               pledgeClass:'Upsilon', crossed:'Fall 2011', status:'Alumni' },

  // Phi — Spring 2012
  { bondNo:172, name:'Joseph Bautista',      nickname:'2 Chainz',                          pledgeClass:'Phi', crossed:'Spring 2012', status:'Alumni' },
  { bondNo:173, name:'Robby Yee',            nickname:'The Great Red Wall',                pledgeClass:'Phi', crossed:'Spring 2012', status:'Alumni' },
  { bondNo:174, name:'Jason Guinto',         nickname:'Frat Star',                         pledgeClass:'Phi', crossed:'Spring 2012', status:'Alumni' },
  { bondNo:175, name:'Terri Plaza',          nickname:'Da Franchise Boy',                  pledgeClass:'Phi', crossed:'Spring 2012', status:'Alumni' },
  { bondNo:176, name:'Jonathan Lowe',        nickname:'Buckets',                           pledgeClass:'Phi', crossed:'Spring 2012', status:'Alumni' },
  { bondNo:177, name:'Baaron Pableo',        nickname:'Breezy ! The Archangel',            pledgeClass:'Phi', crossed:'Spring 2012', status:'Alumni' },

  // Chi — Spring 2013
  { bondNo:178, name:'Rory Sarmiento',       nickname:'Mos Death',                         pledgeClass:'Chi', crossed:'Spring 2013', status:'Alumni' },
  { bondNo:179, name:'Francisco Herrera',    nickname:'The Riddler',                       pledgeClass:'Chi', crossed:'Spring 2013', status:'Alumni' },
  { bondNo:180, name:'Oscar Aguilar',        nickname:'Sweet Tooth',                       pledgeClass:'Chi', crossed:'Spring 2013', status:'Alumni' },
  { bondNo:181, name:'Andrew Salvatin',      nickname:'LMFAO',                             pledgeClass:'Chi', crossed:'Spring 2013', status:'Alumni' },
  { bondNo:182, name:'Anthony Tu Ngo',       nickname:'Snorlax',                           pledgeClass:'Chi', crossed:'Spring 2013', status:'Alumni' },
  { bondNo:183, name:'Andrew Chau',          nickname:'Inc3ndiary',                        pledgeClass:'Chi', crossed:'Spring 2013', status:'Alumni' },

  // Psi — Fall 2013
  { bondNo:184, name:'Victor Ngo',           nickname:'Dynamite Scrapper',                 pledgeClass:'Psi', crossed:'Fall 2013', status:'Alumni' },
  { bondNo:185, name:'Pete Nguyen',          nickname:'Boston Massacre',                   pledgeClass:'Psi', crossed:'Fall 2013', status:'Alumni' },
  { bondNo:186, name:'Garrison Dizon',       nickname:'1-Hitta Quitta',                    pledgeClass:'Psi', crossed:'Fall 2013', status:'Alumni' },
  { bondNo:187, name:'Danny Nguyen',         nickname:'Bullseye',                          pledgeClass:'Psi', crossed:'Fall 2013', status:'Alumni' },
  { bondNo:188, name:'Nelson Baltazar',      nickname:'Pho King Mumbles Mandela',          pledgeClass:'Psi', crossed:'Fall 2013', status:'Alumni' },
  { bondNo:189, name:'Jack Magpusao',        nickname:'The Ripper',                        pledgeClass:'Psi', crossed:'Fall 2013', status:'Alumni' },

  // Alpha Alpha — Spring 2014
  { bondNo:190, name:'Ben Galleta',          nickname:'B10E - The Titan',                  pledgeClass:'Alpha Alpha', crossed:'Spring 2014', status:'Alumni' },
  { bondNo:191, name:'Anthony Tran',         nickname:'The One Fallen S1n',                pledgeClass:'Alpha Alpha', crossed:'Spring 2014', status:'Alumni' },
  { bondNo:192, name:'Zack Zhang',           nickname:'T.R.R. (The Raging Rebel)',         pledgeClass:'Alpha Alpha', crossed:'Spring 2014', status:'Alumni' },
  { bondNo:193, name:'Darren Barnachea',     nickname:'2DBZ',                              pledgeClass:'Alpha Alpha', crossed:'Spring 2014', status:'Alumni' },
  { bondNo:194, name:'Allan Twiford',        nickname:'Trill Boogie',                      pledgeClass:'Alpha Alpha', crossed:'Spring 2014', status:'Alumni' },
  { bondNo:195, name:'Daniel Orena',         nickname:'Deadlift / Sweet Baby Jesus',       pledgeClass:'Alpha Alpha', crossed:'Spring 2014', status:'Alumni' },

  // Alpha Beta — Fall 2014
  { bondNo:196, name:'Christian Quintana',   nickname:'HAKUNA',                            pledgeClass:'Alpha Beta', crossed:'Fall 2014', status:'Alumni' },
  { bondNo:197, name:'Kevin De La Cruz',     nickname:'T.M/N.T (The Martyr/Notorious Trickster)', pledgeClass:'Alpha Beta', crossed:'Fall 2014', status:'Alumni' },
  { bondNo:198, name:'Dennis Quach',         nickname:"whats up, Doc?",                    pledgeClass:'Alpha Beta', crossed:'Fall 2014', status:'Alumni' },
  { bondNo:199, name:'Damian Tran',          nickname:'Da Bruce Lee',                      pledgeClass:'Alpha Beta', crossed:'Fall 2014', status:'Alumni' },
  { bondNo:200, name:'Kim Tongson',          nickname:'The Tr3bl3 Maker, Kong',            pledgeClass:'Alpha Beta', crossed:'Fall 2014', status:'Alumni' },

  // Alpha Gamma — Spring 2015
  { bondNo:201, name:'Jeseah Lingad',        nickname:'The Thrilla From Manila',           pledgeClass:'Alpha Gamma', crossed:'Spring 2015', status:'Alumni' },
  { bondNo:202, name:'Kevin Tran',           nickname:'K1D BOO',                           pledgeClass:'Alpha Gamma', crossed:'Spring 2015', status:'Alumni' },
  { bondNo:203, name:'Matt Robison',         nickname:'KAIOK3N',                           pledgeClass:'Alpha Gamma', crossed:'Spring 2015', status:'Alumni' },
  { bondNo:204, name:'Zach Andoy',           nickname:'Air Griffin',                       pledgeClass:'Alpha Gamma', crossed:'Spring 2015', status:'Alumni' },
  { bondNo:205, name:'Alex Tong',            nickname:'Hot Shot',                          pledgeClass:'Alpha Gamma', crossed:'Spring 2015', status:'Alumni' },
  { bondNo:206, name:'Russel Soberano',      nickname:'Shook Ones',                        pledgeClass:'Alpha Gamma', crossed:'Spring 2015', status:'Alumni' },
  { bondNo:207, name:'Anthony Ayson',        nickname:'A$VP',                              pledgeClass:'Alpha Gamma', crossed:'Spring 2015', status:'Alumni' },

  // Alpha Delta — Fall 2015
  { bondNo:208, name:'James Francis Valdez', nickname:'E.T.',                              pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },
  { bondNo:209, name:'Jaevon Miranda',       nickname:'MAVERICK',                          pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },
  { bondNo:210, name:'Daniel Fernandez',     nickname:'Scarecrow',                         pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },
  { bondNo:211, name:'Dom Amarbayar',        nickname:'ƧKT',                               pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },
  { bondNo:212, name:'Mark Escareces',       nickname:'Sp1ashzone',                        pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },
  { bondNo:213, name:'Vincent Sarian',       nickname:'2oot It and Boot It',               pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },
  { bondNo:214, name:'Niko Villa',           nickname:'RHOzay ; The Rh1n0',               pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },
  { bondNo:215, name:'Kevin Balagat',        nickname:'O.FF T.HE W.ALL',                   pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },
  { bondNo:216, name:'Julian Deguzman',      nickname:'AND.1',                             pledgeClass:'Alpha Delta', crossed:'Fall 2015', status:'Alumni' },

  // Alpha Epsilon — Spring 2016
  { bondNo:217, name:'Isaiah Aquino',        nickname:'Anchor',                            pledgeClass:'Alpha Epsilon', crossed:'Spring 2016', status:'Alumni' },
  { bondNo:218, name:'John Agustin',         nickname:'The Infamous 8 Ball',               pledgeClass:'Alpha Epsilon', crossed:'Spring 2016', status:'Alumni' },
  { bondNo:219, name:'Derrick Hudson II',    nickname:'YEEZΩS~DA CHEETAH',                 pledgeClass:'Alpha Epsilon', crossed:'Spring 2016', status:'Alumni' },
  { bondNo:220, name:'Cody Kieu',            nickname:'U.P.K',                             pledgeClass:'Alpha Epsilon', crossed:'Spring 2016', status:'Alumni' },
  { bondNo:221, name:'Melton Cuevas',        nickname:'Titanic',                           pledgeClass:'Alpha Epsilon', crossed:'Spring 2016', status:'Alumni' },
  { bondNo:222, name:'Gabriel Torralba',     nickname:'Knuckles',                          pledgeClass:'Alpha Epsilon', crossed:'Spring 2016', status:'Alumni' },
  { bondNo:223, name:'Justin Yan',           nickname:'Slayareasf1nest.',                  pledgeClass:'Alpha Epsilon', crossed:'Spring 2016', status:'Alumni' },

  // Alpha Zeta — Fall 2016
  { bondNo:224, name:'Ayinde Okolo',         nickname:'King Kami',                         pledgeClass:'Alpha Zeta', crossed:'Fall 2016', status:'Alumni' },
  { bondNo:225, name:'Raymond Pang',         nickname:'O.P.M.',                            pledgeClass:'Alpha Zeta', crossed:'Fall 2016', status:'Alumni' },
  { bondNo:226, name:'Bailey Cambra',        nickname:'Bronze Kneecap',                    pledgeClass:'Alpha Zeta', crossed:'Fall 2016', status:'Alumni' },

  // Alpha Eta — Spring 2017
  { bondNo:227, name:'Da-Chen Huang',        nickname:'Lightning',                         pledgeClass:'Alpha Eta', crossed:'Spring 2017', status:'Alumni' },
  { bondNo:228, name:'Brandon Gironella',    nickname:'Switchblade',                       pledgeClass:'Alpha Eta', crossed:'Spring 2017', status:'Alumni' },
  { bondNo:229, name:'Derek Tsao',           nickname:'5IMBA',                             pledgeClass:'Alpha Eta', crossed:'Spring 2017', status:'Alumni' },
  { bondNo:230, name:'Jorden Edraisa',       nickname:'Pen Griffey ? The Bul1d0zer',       pledgeClass:'Alpha Eta', crossed:'Spring 2017', status:'Alumni' },
  { bondNo:231, name:'Lorenzo Monta',        nickname:'Da Om; Dragon Warr1or',             pledgeClass:'Alpha Eta', crossed:'Spring 2017', status:'Alumni' },
  { bondNo:232, name:'Michael Osorio',       nickname:'The Explo$ive TroopAH',             pledgeClass:'Alpha Eta', crossed:'Spring 2017', status:'Alumni' },
  { bondNo:233, name:'Phuoc Vo',             nickname:'o.MEGA',                            pledgeClass:'Alpha Eta', crossed:'Spring 2017', status:'Alumni' },
  { bondNo:234, name:'Eric Pala',            nickname:'The Joker',                         pledgeClass:'Alpha Eta', crossed:'Spring 2017', status:'Alumni' },

  // Alpha Theta — Fall 2017
  { bondNo:235, name:'Aaron Yeung',          nickname:'The D.Y.nasty-V2',                  pledgeClass:'Alpha Theta', crossed:'Fall 2017', status:'Alumni' },
  { bondNo:236, name:'Tony Duong',           nickname:'DA PEGA211S',                       pledgeClass:'Alpha Theta', crossed:'Fall 2017', status:'Alumni' },

  // Alpha Iota — Spring 2018
  { bondNo:237, name:'Austin Quicho',        nickname:'XO! The $outhbay $EAL',             pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:238, name:'Jaevante Valenciano',  nickname:'Dum Kennedy//Ki1m0nger',            pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:239, name:'Dustin Tong',          nickname:'B.A.T',                             pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:241, name:'Edward Garcia',        nickname:'B.$.B.',                            pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:242, name:'Redmond Vera',         nickname:'Thv Pr1nc3',                        pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:243, name:'Sam Nguyen',           nickname:'R.I.P',                             pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:244, name:'Calvin Nguyen',        nickname:'O.T.S 2x $carFace',                pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:245, name:'Austin Apolonia',      nickname:'AB-Sol',                            pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:246, name:'Remy Huynh',           nickname:'CLOUD-burst',                       pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:247, name:'Jason Ni',             nickname:'Experiment 626',                    pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:248, name:'Joseph Yuzon',         nickname:'Straight Razor',                    pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },
  { bondNo:249, name:'James Custodio',       nickname:'T.H.E Baby Faze Assas1n',           pledgeClass:'Alpha Iota', crossed:'Spring 2018', status:'Alumni' },

  // Alpha Kappa — Fall 2018
  { bondNo:250, name:'Daniel Dulay',         nickname:'TeeCee400 . MOD10K',                pledgeClass:'Alpha Kappa', crossed:'Fall 2018', status:'Alumni' },
  { bondNo:251, name:'Henry Duong',          nickname:'THE LONE WΩLF, S1N OF GREED',      pledgeClass:'Alpha Kappa', crossed:'Fall 2018', status:'Alumni' },
  { bondNo:252, name:'Cristian Dela Cruz',   nickname:'T.hv notoriou$ k1d trunkz',         pledgeClass:'Alpha Kappa', crossed:'Fall 2018', status:'Alumni' },
  { bondNo:253, name:'Ryan Vong',            nickname:'The Lost A1rbender',                pledgeClass:'Alpha Kappa', crossed:'Fall 2018', status:'Alumni' },
  { bondNo:254, name:'Quinten Pabon',        nickname:'The Whiteball KilluhH',             pledgeClass:'Alpha Kappa', crossed:'Fall 2018', status:'Alumni' },
  { bondNo:255, name:'Chandara Heng',        nickname:'C-4',                               pledgeClass:'Alpha Kappa', crossed:'Fall 2018', status:'Alumni' },
  { bondNo:256, name:'Paul Nguyen',          nickname:'RED E.X. DA MENACE',                pledgeClass:'Alpha Kappa', crossed:'Fall 2018', status:'Alumni' },

  // Alpha Lambda — Spring 2019
  { bondNo:257, name:'Ben Srioudom',         nickname:'Oui(*) The $outheast $I1V3RBAhhK',  pledgeClass:'Alpha Lambda', crossed:'Spring 2019', status:'Alumni' },
  { bondNo:258, name:'Vincent Naval',        nickname:'Ace Diablo H.D.',                   pledgeClass:'Alpha Lambda', crossed:'Spring 2019', status:'Alumni' },
  { bondNo:259, name:'Philip Phan',          nickname:'SS3',                               pledgeClass:'Alpha Lambda', crossed:'Spring 2019', status:'Alumni' },
  { bondNo:260, name:'Jahee Wright',         nickname:'Deathstroke',                       pledgeClass:'Alpha Lambda', crossed:'Spring 2019', status:'Alumni' },
  { bondNo:261, name:'Mark Morales',         nickname:'L1l B0at',                          pledgeClass:'Alpha Lambda', crossed:'Spring 2019', status:'Alumni' },
  { bondNo:262, name:'Ryan Dasmarinas',      nickname:'TOTAΛ HEARTBREAK (Day) / TOTAΛ RECALL (Night)', pledgeClass:'Alpha Lambda', crossed:'Spring 2019', status:'Alumni' },
  { bondNo:263, name:'Andrei Soriano',       nickname:'DREAM.$HVKE',                       pledgeClass:'Alpha Lambda', crossed:'Spring 2019', status:'Alumni' },

  // Alpha Mu — Fall 2019
  { bondNo:264, name:'John Clark',           nickname:'PS1-B0RG',                          pledgeClass:'Alpha Mu', crossed:'Fall 2019', status:'Alumni' },
  { bondNo:265, name:'Joshua Ho',            nickname:'B3astBoi',                          pledgeClass:'Alpha Mu', crossed:'Fall 2019', status:'Alumni' },
  { bondNo:266, name:'Jonathan Van',         nickname:'T.O.D',                             pledgeClass:'Alpha Mu', crossed:'Fall 2019', status:'Alumni' },
  { bondNo:267, name:'Howard Sham',          nickname:'D3NDE',                             pledgeClass:'Alpha Mu', crossed:'Fall 2019', status:'Alumni' },
  { bondNo:268, name:'William Hoang',        nickname:'Blood Akum4',                       pledgeClass:'Alpha Mu', crossed:'Fall 2019', status:'Alumni' },

  // Alpha Nu — Spring 2020
  { bondNo:269, name:'Kobe Mercado',         nickname:'$HOW.STOP',                         pledgeClass:'Alpha Nu', crossed:'Spring 2020', status:'Alumni' },
  { bondNo:270, name:'Ethan Guevara',        nickname:'O.T.F. Deadshot Re10aded',          pledgeClass:'Alpha Nu', crossed:'Spring 2020', status:'Alumni' },
  { bondNo:271, name:'Khai Nguyen',          nickname:'D.A.B. (DA ADOLE$CENT BAWLER)',     pledgeClass:'Alpha Nu', crossed:'Spring 2020', status:'Alumni' },
  { bondNo:272, name:'Eleazor Billones',     nickname:"W1LDA'BEE$T",                       pledgeClass:'Alpha Nu', crossed:'Spring 2020', status:'Alumni' },

  // Alpha Xi — Fall 2021
  { bondNo:273, name:'Justin Yu',            nickname:'Da awak1nd $eOul',                  pledgeClass:'Alpha Xi', crossed:'Fall 2021', status:'Alumni' },
  { bondNo:274, name:'Alex Ho',              nickname:'t.C.-K1D (th3.COM3BACK-K1DD)',      pledgeClass:'Alpha Xi', crossed:'Fall 2021', status:'Alumni' },
  { bondNo:275, name:'Kristian Edraisa',     nickname:'Blxst . Sub-Zero',                  pledgeClass:'Alpha Xi', crossed:'Fall 2021', status:'Alumni' },
  { bondNo:276, name:'Kent Tran',            nickname:'MAΞIMUHM CARNAGE',                  pledgeClass:'Alpha Xi', crossed:'Fall 2021', status:'Alumni' },

  // Alpha Omicron — Spring 2022
  { bondNo:277, name:'Gerardo Bagalso',      nickname:'GR1M x Northea$t LEATHuhBACK',      pledgeClass:'Alpha Omicron', crossed:'Spring 2022', status:'Alumni' },
  { bondNo:278, name:'Vinh Phan',            nickname:'lil mac (-10)',                      pledgeClass:'Alpha Omicron', crossed:'Spring 2022', status:'Alumni' },
  { bondNo:279, name:'Jason Do',             nickname:'S.2.O.-$tormShadow',                pledgeClass:'Alpha Omicron', crossed:'Spring 2022', status:'Alumni' },
  { bondNo:280, name:'Adriel Morales',       nickname:'T-EYE $ the VulTure',               pledgeClass:'Alpha Omicron', crossed:'Spring 2022', status:'Alumni' },
  { bondNo:281, name:'Ethan Santos',         nickname:'da PHOENIX!',                       pledgeClass:'Alpha Omicron', crossed:'Spring 2022', status:'Alumni' },
  { bondNo:282, name:'Amell Sta. Maria',     nickname:'KENPVCHI',                          pledgeClass:'Alpha Omicron', crossed:'Spring 2022', status:'Alumni' },

  // Alpha Pi — Fall 2022
  { bondNo:283, name:'Jacel Evangelista',    nickname:'CLAR1TY',                           pledgeClass:'Alpha Pi', crossed:'Fall 2022', status:'Alumni' },
  { bondNo:284, name:'Devin Pak',            nickname:'Inumaki',                           pledgeClass:'Alpha Pi', crossed:'Fall 2022', status:'Alumni' },
  { bondNo:285, name:'Jalen Arbis',          nickname:'D1VN3~AΠΘllO (Day) / S19$τ3R ! CR3ED (Night)', pledgeClass:'Alpha Pi', crossed:'Fall 2022', status:'Alumni' },
  { bondNo:286, name:'Alex Yee',             nickname:'DA STOIC/R2-D2',                    pledgeClass:'Alpha Pi', crossed:'Fall 2022', status:'Alumni' },
  { bondNo:287, name:'Aivan Torres',         nickname:'OTC the Rag1ng Tsukiy0mi',          pledgeClass:'Alpha Pi', crossed:'Fall 2022', status:'Alumni' },
  { bondNo:288, name:'Alex Phan',            nickname:'P.ROTOTYP3',                        pledgeClass:'Alpha Pi', crossed:'Fall 2022', status:'Alumni' },

  // Alpha Rho — Fall 2023
  { bondNo:289, name:'Carson Mandigma',      nickname:'Th3 Asc2nding $usanoo',             pledgeClass:'Alpha Rho', crossed:'Fall 2023', status:'Active' },
  { bondNo:290, name:'Miles Nabeta',         nickname:'VOORHEES',                          pledgeClass:'Alpha Rho', crossed:'Fall 2023', status:'Active' },
  { bondNo:291, name:'Joseph Bonnardel',     nickname:'DUbLÉ DΔ ENT3RTVINER',             pledgeClass:'Alpha Rho', crossed:'Fall 2023', status:'Active' },
  { bondNo:292, name:'Matthew Brian Bautista',nickname:'Y.6-L',                            pledgeClass:'Alpha Rho', crossed:'Fall 2023', status:'Active' },
  { bondNo:293, name:'Cayden Leung',         nickname:'YAMCHA',                            pledgeClass:'Alpha Rho', crossed:'Fall 2023', status:'Active' },
  { bondNo:294, name:'Jordan Louangxaysongkham', nickname:'JU1CE ? D0OM',                  pledgeClass:'Alpha Rho', crossed:'Fall 2023', status:'Active' },

  // Alpha Sigma — Spring 2024
  { bondNo:295, name:'Owen Soy',             nickname:'cHR0N¡¡c',                          pledgeClass:'Alpha Sigma', crossed:'Spring 2024', status:'Active' },
  { bondNo:296, name:'Andrei Magno',         nickname:'IΣANAΓ1 (day) /  ΣZANAΠ1 (night)',   pledgeClass:'Alpha Sigma', crossed:'Spring 2024', status:'Active' },

  // Alpha Tau — Fall 2024
  { bondNo:297, name:'Alex Tran',            nickname:'LONG.$HOT-K1LLA',                   pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:298, name:'Brandon Tam',          nickname:'S*O*S',                             pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:299, name:'Tyler Ton',            nickname:'The GhΩ2τ Of Zama',                 pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:300, name:'Trevor Bananal',       nickname:'T.N.T',                             pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:301, name:'Riley Coladilla',      nickname:'Ultra Instinct',                    pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:302, name:'Krystofer Bagunu',     nickname:'THE HOUND',                         pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:303, name:'Terrence Diaz',        nickname:'BullZΞyz',                          pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:304, name:'Jaison Tan',           nickname:'1ROΠHIDE',                          pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:305, name:'Isiah Summerhill',     nickname:'YATTA! DA UNFORS7KEN MESSIAH',      pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:306, name:'Daniel Aguilar',       nickname:'EL 5ũave',                          pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:307, name:'Jakob Frijas',         nickname:'$$ KOD1Acc[^]ΣOuLjA Boi',          pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:308, name:'Michael Trambulo',     nickname:'20UΠD.WAV3',                        pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },
  { bondNo:309, name:'Ethan Ramos',          nickname:'O.T.G Sh1-Fo0',                     pledgeClass:'Alpha Tau', crossed:'Fall 2024', status:'Active' },

  // Alpha Upsilon — Spring 2025
  { bondNo:310, name:'Ryan Verdote',         nickname:'Z4WMB.KiiD',              pledgeClass:'Alpha Upsilon', crossed:'Spring 2025', status:'Active' },
  { bondNo:311, name:'Barrett Jones',        nickname:'Da ika1ka $illa',                   pledgeClass:'Alpha Upsilon', crossed:'Spring 2025', status:'Active' },

  // Alpha Phi — Fall 2025
  { bondNo:312, name:'Kalib Sengsone',       nickname:'CH2DΩRI',                           pledgeClass:'Alpha Phi', crossed:'Fall 2025', status:'Active' },
  { bondNo:313, name:'Caden Tamares',        nickname:'0.T.R LΦK1',                        pledgeClass:'Alpha Phi', crossed:'Fall 2025', status:'Active' },
  { bondNo:314, name:'Ethan Su',             nickname:'S1LK () BANE',                      pledgeClass:'Alpha Phi', crossed:'Fall 2025', status:'Active' },
];

// ─────────────────────────────────────────────
// Parse Google Sheet (columns: A=Class, B=Bond#, C=Name, D=Nickname)
// The Class column is merged so only the first row of each class has a value
// ─────────────────────────────────────────────
async function fetchSheet() {
  if (!SHEET_ID || SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') return null;
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const brothers = [];
    let currentClass = '';
    let currentCrossed = '';

    for (const row of rows) {
      if (!row.c) continue;
      const colA = row.c[0]?.v || '';
      const bondNo = row.c[1]?.v || '';
      const name = row.c[2]?.v || '';
      const nickname = row.c[3]?.v || '';

      if (!name || name === 'N/A') continue;

      // Parse class from column A (e.g. "Alpha Tau\nClass Fall 2024" or "Founding Fathers\nEst. March 1st 2000")
      if (colA) {
        const lines = colA.toString().split('\n');
        currentClass = lines[0].trim();
        // Extract semester/year from second line
        const semMatch = colA.match(/(Spring|Fall|Winter|Summer)\s+\d{4}/i);
        currentCrossed = semMatch ? semMatch[0] : '';
      }

      // Determine status — classes from 2023 onwards are Active, rest Alumni
      const yearMatch = currentCrossed.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 0;
      const status = year >= 2023 ? 'Active' : 'Alumni';

      brothers.push({ bondNo, name, nickname, pledgeClass: currentClass, crossed: currentCrossed, status });
    }
    return brothers;
  } catch (e) {
    console.warn('Sheet fetch failed, using local data', e);
    return null;
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function Brothers() {
  const [brothers, setBrothers]   = useState(ALL_BROTHERS);
  const [filter, setFilter]       = useState('All');
  const [openClass, setOpenClass] = useState(null);

  useEffect(() => {
    fetchSheet().then(data => { if (data) setBrothers(data); });
  }, []);

  const filtered = filter === 'All' ? brothers : brothers.filter(b => b.status === filter);

  // Group by pledge class in Greek order
  const grouped = {};
  for (const cls of CLASS_ORDER) {
    const members = filtered.filter(b => b.pledgeClass === cls);
    if (members.length > 0) grouped[cls] = members;
  }

  const initials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <section className="brothers" id="brothers">
      <div className="brothers__banner">
        <div className="container">
          <p className="section-eyebrow">The Brhotherhood</p>
          <h2 className="section-title">Brhothers of Alpha Psi Rho</h2>
          <div className="divider" />
        </div>
      </div>

      <div className="container brothers__body">
        {/* Filter */}
        <div className="brothers__filters">
          {['All', 'Active', 'Alumni'].map(f => (
            <button
              key={f}
              className={`brothers__filter-btn ${filter === f ? 'brothers__filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
          <span className="brothers__total">{filtered.length} brothers</span>
        </div>

        {/* Accordion */}
        <div className="brothers__accordion">
          {Object.entries(grouped).map(([cls, members]) => {
            const isOpen = openClass === cls;
            const greekSymbol = cls.split(' ').map(w => {
              const map = { Founding:'✦', Charter:'✦', Alpha:'Α', Beta:'Β', Gamma:'Γ', Delta:'Δ', Epsilon:'Ε', Zeta:'Ζ', Eta:'Η', Theta:'Θ', Iota:'Ι', Kappa:'Κ', Lambda:'Λ', Mu:'Μ', Nu:'Ν', Xi:'Ξ', Omicron:'Ο', Pi:'Π', Rho:'Ρ', Sigma:'Σ', Tau:'Τ', Upsilon:'Υ', Phi:'Φ', Chi:'Χ', Psi:'Ψ' };
              return map[w] || '';
            }).filter(Boolean).join('');

            return (
              <div key={cls} className={`brothers__row ${isOpen ? 'brothers__row--open' : ''}`}>
                <button
                  className="brothers__class-btn"
                  onClick={() => setOpenClass(isOpen ? null : cls)}
                >
                  <div className="brothers__class-left">
                    <span className={`brothers__class-symbol ${(greekSymbol || cls[0]).length > 1 ? 'brothers__class-symbol--double' : ''}`}>
                      {greekSymbol || cls[0]}
                    </span>
                    <div className="brothers__class-labels">
                      <span className="brothers__class-name">{cls} Class</span>
                      {CLASS_NAMES[cls] && CLASS_NAMES[cls] !== `${cls} Class` && (
                        <span className="brothers__class-fullname">{CLASS_NAMES[cls]}</span>
                      )}
                      {members[0]?.crossed && (
                        <span className="brothers__class-crossed">Crossed {members[0].crossed}</span>
                      )}
                    </div>
                  </div>
                  <div className="brothers__class-right">
                    <span className="brothers__class-count">
                      {members.length} {members.length === 1 ? 'brhother' : 'brhothers'}
                    </span>
                    <div className="brothers__avatar-stack">
                      {members.slice(0, 4).map((b, i) => (
                        <div key={i} className={`brothers__stack-av ${b.status === 'Alumni' ? 'brothers__stack-av--alum' : ''}`}>
                          {initials(b.name)}
                        </div>
                      ))}
                      {members.length > 4 && (
                        <div className="brothers__stack-av brothers__stack-av--more">+{members.length - 4}</div>
                      )}
                    </div>
                    <span className="brothers__chevron">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="brothers__panel">
                    <div className="brothers__cards-grid">
                      {members.map((b, i) => (
                        <div key={i} className={`brothers__card ${b.status === 'Alumni' ? 'brothers__card--alumni' : ''}`}>
                          <div className="brothers__card-top">
                            <div className="brothers__card-avatar">{initials(b.name)}</div>
                            <div className="brothers__card-info">
                              <p className="brothers__card-name">{b.name}</p>
                              <span className="brothers__card-bond">#{b.bondNo}</span>
                            </div>
                          </div>
                          <div className="brothers__card-body">
                            {!b.minimal && (
                              <>
                                <div className="brothers__card-row">
                                  <span className="brothers__card-label">Nickname</span>
                                  <span className="brothers__card-nick">&ldquo;{b.nickname}&rdquo;</span>
                                </div>
                                <div className="brothers__card-row">
                                  <span className="brothers__card-label">Crossed</span>
                                  <span className="brothers__card-val">{b.crossed}</span>
                                </div>
                                <div className="brothers__card-row">
                                  <span className="brothers__card-label">Status</span>
                                  <span className="brothers__card-val">{b.status}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
