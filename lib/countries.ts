const codes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");
const names = new Intl.DisplayNames(["en"], {type:"region"});
const defaults: Record<string,string> = {
 AE:"AED", CA:"CAD", US:"USD", PK:"PKR", CN:"CNY", GB:"GBP", IN:"INR", AU:"AUD", NZ:"NZD", JP:"JPY",
 SG:"SGD", SA:"SAR", QA:"QAR", KW:"KWD", BH:"BHD", OM:"OMR", TR:"TRY", CH:"CHF", ZA:"ZAR", MY:"MYR", BD:"BDT",
 AD:"EUR", AT:"EUR", BE:"EUR", CY:"EUR", DE:"EUR", EE:"EUR", ES:"EUR", FI:"EUR", FR:"EUR", GR:"EUR", HR:"EUR",
 AG:"XCD", AI:"XCD", BI:"BIF", CD:"CDF", DM:"XCD", GD:"XCD", GM:"GMD", GN:"GNF", HT:"HTG", KN:"XCD", KP:"KPW",
 LC:"XCD", LI:"CHF", LR:"LRD", MP:"USD", MR:"MRU", MS:"XCD", PN:"NZD", PS:"ILS", SJ:"NOK", SL:"SLE", ST:"STN",
 TF:"EUR", TL:"USD", VC:"XCD", BV:"USD",
 IE:"EUR", IT:"EUR", LT:"EUR", LU:"EUR", LV:"EUR", MC:"EUR", ME:"EUR", MT:"EUR", NL:"EUR", PT:"EUR", SI:"EUR",
 SK:"EUR", SM:"EUR", VA:"EUR", BG:"BGN", CZ:"CZK", DK:"DKK", HU:"HUF", IS:"ISK", NO:"NOK", PL:"PLN", RO:"RON",
 RS:"RSD", SE:"SEK", UA:"UAH", RU:"RUB", BY:"BYN", AL:"ALL", BA:"BAM", MK:"MKD", MD:"MDL", GE:"GEL", AM:"AMD", AZ:"AZN",
 HK:"HKD", MO:"MOP", TW:"TWD", KR:"KRW", TH:"THB", ID:"IDR", VN:"VND", PH:"PHP", MM:"MMK", KH:"KHR", LA:"LAK", MN:"MNT",
 NP:"NPR", LK:"LKR", MV:"MVR", BN:"BND", FJ:"FJD", PG:"PGK", WS:"WST", TO:"TOP", VU:"VUV", SB:"SBD", PF:"XPF", NC:"XPF",
 BR:"BRL", MX:"MXN", AR:"ARS", CL:"CLP", CO:"COP", PE:"PEN", UY:"UYU", BO:"BOB", PY:"PYG", EC:"USD", SV:"USD", PA:"USD",
 GT:"GTQ", CR:"CRC", HN:"HNL", NI:"NIO", DO:"DOP", JM:"JMD", TT:"TTD", BB:"BBD", BS:"BSD", BZ:"BZD", GY:"GYD", SR:"SRD",
 AW:"AWG", CW:"ANG", SX:"ANG", KY:"KYD", BM:"BMD", BQ:"USD", VG:"USD", TC:"USD", PR:"USD", VI:"USD", GU:"USD", AS:"USD",
 EG:"EGP", MA:"MAD", DZ:"DZD", TN:"TND", LY:"LYD", NG:"NGN", KE:"KES", UG:"UGX", TZ:"TZS", RW:"RWF", GH:"GHS", ET:"ETB",
 NA:"NAD", BW:"BWP", ZM:"ZMW", MZ:"MZN", AO:"AOA", MU:"MUR", SC:"SCR", SD:"SDG", SS:"SSP", SO:"SOS", DJ:"DJF",
 ER:"ERN", LS:"LSL", SZ:"SZL", MW:"MWK", ZW:"ZWL", CM:"XAF", CF:"XAF", TD:"XAF", CG:"XAF", GA:"XAF", GQ:"XAF",
 BJ:"XOF", BF:"XOF", CI:"XOF", GW:"XOF", ML:"XOF", NE:"XOF", SN:"XOF", TG:"XOF", KM:"KMF", MG:"MGA", CV:"CVE",
 AF:"AFN", IR:"IRR", IQ:"IQD", JO:"JOD", IL:"ILS", LB:"LBP", SY:"SYP", YE:"YER", KZ:"KZT", UZ:"UZS", KG:"KGS", TJ:"TJS",
 TM:"TMT", BT:"BTN", CU:"CUP", VE:"VES", FM:"USD", MH:"USD", PW:"USD", KI:"AUD",
 NR:"AUD", TV:"AUD", CX:"AUD", CC:"AUD", NF:"AUD", CK:"NZD", NU:"NZD", TK:"NZD", WF:"XPF", YT:"EUR", RE:"EUR", GP:"EUR",
 GF:"EUR", MQ:"EUR", BL:"EUR", MF:"EUR", PM:"EUR", AX:"EUR", FO:"DKK", GL:"DKK", JE:"GBP", GG:"GBP", IM:"GBP", GI:"GIP",
 FK:"FKP", SH:"SHP", GS:"GBP", IO:"USD", UM:"USD", AQ:"USD", EH:"MAD", XK:"EUR"
};
export const countries = codes.map(code=>({code,name:names.of(code)||code,flag:String.fromCodePoint(...Array.from(code).map(c=>127397+c.charCodeAt(0))),currency:defaults[code]||"USD"})).sort((a,b)=>a.name.localeCompare(b.name));
export const currencyForCountryName = (name: string) => countries.find(c => c.name.toLowerCase() === name.toLowerCase() || c.code.toLowerCase() === name.toLowerCase())?.currency || null;
export const flagForCountryName = (name: string) => countries.find(c => c.name.toLowerCase() === name.toLowerCase() || c.code.toLowerCase() === name.toLowerCase())?.flag || "🌐";
