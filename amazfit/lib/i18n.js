import { localStorage } from '@zos/storage'

var strings = {
  en: {
    cigarettes_today: 'CIGARETTES TODAY',
    add_cigarette: '+ cigarette',
    correct: '- correct',
    history: 'history',
    settings: 'settings',
    last_cigarette: 'last cigarette',
    none_today: 'none today',
    now: 'just now',
    ago: 'ago',
    history_14: '14-DAY HISTORY',
    avg_every: 'avg: every ',
    edit_day: 'EDIT DAY',
    back: 'back',
    today: 'Today',
    language: 'LANGUAGE',
    end_day: 'END DAY AT',
    credits: 'CREDITS',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    quotes: [
      'quit smoking you moron',
      '-11 minutes of life lol',
      'your lungs hate you',
      'you stink of ashtray bro',
      'paying to die sooner',
      'not even the filter saves you',
      'another nail in the coffin',
      'your wallet is crying',
      'mmm tar slurp',
      'even your dog wont kiss you',
      'par o cazz',
      'pesce a brodo',
      'good job goat',
      'why do you even bother',
      'congrats genius',
      'cough with style',
      'yellow teeth are trendy',
      'disgusting bro',
      'bronchitis incoming',
      'ashtray air',
      'ua par camus',
      'the doctor is crying',
      'lungs level: tar',
      'how much do you spend monthly',
      'breath of a dead dragon',
      'great choice champ',
      'again? seriously?',
      'stairs hate you',
      'fast as a snail',
      'ironic applause'
    ]
  },
  it: {
    cigarettes_today: 'SIGARETTE OGGI',
    add_cigarette: '+ sigaretta',
    correct: '- correggi',
    history: 'storico',
    settings: 'impostazioni',
    last_cigarette: 'ultima sigaretta',
    none_today: 'nessuna oggi',
    now: 'adesso',
    ago: 'fa',
    history_14: 'STORICO 14 GIORNI',
    avg_every: 'media: ogni ',
    edit_day: 'MODIFICA GIORNO',
    back: 'indietro',
    today: 'Oggi',
    language: 'LINGUA',
    end_day: 'FINE GIORNO ALLE',
    credits: 'CREDITI',
    days: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    months: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    quotes: [
      'smetti di fumare coglione',
      '-11 minuti di vita lol',
      'i tuoi polmoni ti odiano',
      'puzzi di posacenere fratm',
      'stai pagando per morirti prima',
      'manco il filtro ti salva ormai',
      'un altro chiodo nella bara',
      'il tuo portafoglio piange',
      'mmm catrame slurp',
      'nemmeno il tuo cane ti bacia piu',
      'par o cazz',
      'pesce a brodo',
      'e brava la capra',
      'ma chi te lo fa fare',
      'complimenti genio',
      'tossisci con stile',
      'i denti gialli fan tendenza',
      'che schifo fratello',
      'bronchite incoming',
      'aria di posacenere',
      'ua par camus',
      'il dottore piange',
      'polmoni livello catrame',
      'ma quanto spendi al mese',
      'fiato da drago morto',
      'bella scelta campione',
      'ancora? sul serio?',
      'le scale ti odiano',
      'veloce come una lumaca',
      'applauso ironico'
    ]
  }
}

export function getLang() {
  try {
    var lang = localStorage.getItem('sig_lang')
    if (lang === 'it' || lang === 'en') return lang
  } catch(e) {}
  return 'en'
}

export function setLang(lang) {
  try {
    localStorage.setItem('sig_lang', lang)
  } catch(e) {}
}

export function t(key) {
  var lang = getLang()
  var s = strings[lang] || strings.en
  return s[key] !== undefined ? s[key] : key
}
