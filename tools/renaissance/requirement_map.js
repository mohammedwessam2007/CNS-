// Every numbered section of the three mission texts → the canonical requirement nodes that carry it (§4–5).
// The coverage oracle fails if a section is missing here, if a section here does not exist in the texts, or if a
// node named here does not exist. One section may feed several nodes; many sections feed one node (the missions
// repeat themselves across generations, so the graph is smaller than the text).
'use strict';
const M1 = `
0 northstar|1 northstar|2 declarations|3 door controls|4 inside|5 primary|6 vocab|7 vocab|8 ease|9 satisfaction|10 click
11 precise inside|12 precise|13 precise xray|14 xray|15 reps|16 L1|17 prereq|18 wormholes|19 prereq|20 wormholes
21 periodic|22 periodic|23 periodic|24 newsense|25 masterpiece|26 intuition|27 civgraph|28 canon|29 canon|30 discovery
31 discovery|32 discovery|33 discovery|34 discovery|35 alien|36 perspectives|37 perspectives|38 contradiction|39 immune|40 beliefs
41 calib|42 question|43 question|44 unknownconcept|45 unknown|46 unknown|47 periodic|48 worldmodel|49 worldmodel|50 gc
51 gc|52 memory|53 gc twin|54 wormholes|55 compounding|56 compiler|57 wormholes compiler|58 wormholes|59 discovery|60 taste
61 taste|62 masterpiece|63 boredom|64 curiosity|65 foundry|66 boss|67 boss|68 alien|69 explain|70 boss
71 creation|72 invention|73 invention|74 realitybridge|75 realitybridge|76 realitybridge|77 realitybridge|78 twin|79 genome|80 possibility
81 fiv|82 originality|83 asymmetry|84 faculty|85 faculty|86 laws|87 laws|88 compiler|89 arc|90 compiler civgraph
91 ontology|92 ontology|93 autophagy|94 selfimprove|95 selfimprove|96 selfimprove|97 selfimprove L14|98 selfimprove|99 selfimprove|100 selfimprove
101 possibility|102 possibility|103 possibility|104 civgraph prereq|105 frontierradar|106 frontierradar|107 provenance|108 nohalluc|109 perspectives conflict|110 calib claims
111 stoprule|112 dose|113 door life|114 inside|115 ledger declarations|116 benchlab|117 benchlab empirical|118 fiv benchlab|119 benchlab|120 benchlab
121 alien geniusdelta|122 explain benchlab|123 realitybridge calib|124 hostile|125 nodash|126 redteam|127 registry|128 registry|129 registry|130 registry
131 registry|132 registry|133 registry ontology|134 ontology|135 originality registry|136 claims|137 originality|138 research|139 provenance|140 rights
141 reps media primary|142 noslopvis|143 media|144 dose life|145 nodebt|146 safeexp unknown|147 attention|148 arc|149 reps curiosity|150 discovery reps
151 zoom|152 zoom|153 zoom|154 boredom|155 laws|156 scaffold|157 scaffold|158 scaffold alien|159 antipretension|160 conversation
161 writing|162 cultivation socialfeedback|163 lifelinks|164 lifelinks|165 uberbond|166 lifelinks|167 principles|168 longitudinal|169 possibility|170 possibility
171 longitudinal device|172 atscale|173 declarations|174 declarations|175 declarations empirical|176 implement|177 door|178 controls|179 controls|180 controls scaffold
181 controls|182 inside|183 why|184 sessionobj|185 receipt|186 twin possession|187 nodash|188 registry ontology|189 lineage|190 masterpiece
191 exocortex|192 exocortex|193 exocortex|194 sovereignty|195 principles|196 principles satisfaction|197 boredom|198 controls boredom|199 xray|200 ease
201 research|202 registry|203 arch|204 benchlab|205 hostile|206 door controls|207 longitudinal|208 geniusdelta|209 texture|210 counterfeit antipretension
211 scaffold|212 life|213 arch|214 autonomy|215 autonomy|216 tournament|217 registry originality|218 continuity|219 possibility|220 northstar
221 redteam|222 declarations|223 claims|224 door controls|225 northstar`;
const M2 = `
0 lineage|1 research|2 ease|3 inside|4 masterpiece primary|5 primary|6 realitybridge|7 fiv|8 observability|9 threebox|10 vocab
11 vocab|12 vocab|13 precise|14 asymmetry|15 satisfaction|16 click|17 civgraph compiler|18 genome|19 periodic|20 periodic
21 periodic|22 newsense|23 reps|24 L1 reps|25 foundry|26 prereq|27 wormholes|28 prereq|29 wormholes|30 wormholes
31 wormholes|32 wormholes|33 masterpiece|34 intuition|35 discovery|36 discovery|37 discovery|38 discovery|39 alien|40 unknownconcept
41 question|42 question|43 immune|44 beliefs|45 calib|46 contradiction|47 perspectives|48 perspectives|49 worldmodel|50 worldmodel
51 gc|52 gc|53 memory|54 gc|55 taste|56 taste newsense|57 taste|58 creation|59 invention|60 invention
61 realitybridge|62 realitybridge|63 twin|64 laws|65 laws|66 xray|67 precise xray|68 scaffold|69 scaffold|70 alien
71 explain|72 boss|73 boss|74 frontierradar|75 frontierradar|76 unknown|77 unknown|78 periodic|79 canon|80 canon
81 possibility|82 possibility|83 possibility|84 objective|85 stoprule|86 dose|87 nodebt|88 nodebt|89 life sovereignty|90 selfimprove
91 selfimprove|92 selfimprove|93 selfimprove|94 selfimprove|95 selfimprove|96 selfimprove|97 selfimprove|98 possibility selfimprove|99 ontology|100 registry
101 registry|102 registry|103 registry|104 registry|105 registry|106 registry|107 registry|108 registry|109 registry|110 registry
111 registry|112 registry|113 registry|114 registry|115 registry|116 registry|117 registry|118 registry|119 registry|120 registry
121 registry|122 registry|123 registry|124 registry ontology|125 ontology|126 ontology|127 lineage|128 objective|129 gaming|130 counterfeit
131 explain|132 scaffold|133 perspectives|134 threebox|135 masterpiece threebox|136 life|137 noaddiction|138 counterfeit|139 wormholes antipretension|140 perspectives
141 global|142 providerneutral|143 gaming|144 claims|145 benchlab|146 benchlab|147 benchlab empirical|148 alien|149 velocity|150 velocity
151 geniusdelta|152 fiv claims|153 benchlab|154 claims empirical|155 declarations|156 implement|157 implement|158 research|159 continuity|160 priorart
161 rights|162 provenance nohalluc|163 provenance|164 controls|165 nodash|166 compiler|167 sessionobj|168 arc|169 arc door|170 longitudinal
171 compiler|172 compiler|173 ledger claims|174 atscale|175 declarations|176 redteam declarations|177 ontology|178 ontology|179 ontology|180 omegadeliv
181 omegadeliv ledger|182 declarations|183 northstar`;
const M3 = `
0 continuity|1 northstar boot|2 door controls|3 oracle|4 oracle|5 oracle|6 ledger|7 ledger redteam|8 possession|9 masterpiece|10 masterpiece
11 karamazov|12 readerturing|13 quotes|14 primary|15 oatmeal|16 lit atscale|17 math|18 science|19 history|20 philosophy
21 art|22 music|23 film|24 architecture|25 religion|26 global globaldepth|27 arabic|28 cultivation|29 society|30 salon
31 museum|32 concert|33 conversation|34 language|35 boot|36 multiplex|37 multiplex|38 fiv claims|39 observability|40 threebox
41 question|42 alien|43 sealed|44 geniusdelta|45 velocity|46 velocity|47 development|48 development|49 northstar|50 northstar
51 longitudinal|52 longitudinal|53 originality|54 invention|55 question|56 unknownconcept|57 unknown|58 unknown|59 periodic|60 genome
61 periodic|62 periodic|63 periodic|64 wormholes|65 wormholes compounding|66 wormholes|67 wormholes|68 prereq|69 reps|70 L1 L2 L3 L5
71 safeexp|72 L1 L2 L3 L4 L5 L6 L7 L8 L9 L10 L11 L12 L13 L14|73 safeexp|74 laws|75 laws|76 xray|77 precise|78 precise|79 vocab|80 vocab
81 ease|82 curiosity|83 satisfaction|84 click|85 boredom|86 foundry|87 foundry|88 intuition|89 discovery|90 discovery
91 discovery|92 discovery|93 immune|94 antipretension|95 beliefs|96 contradiction|97 calib|98 worldmodel|99 worldmodel|100 gc
101 gc|102 memory|103 gc|104 scaffold|105 scaffold|106 realitybridge|107 realitybridge lifelinks|108 uberbond|109 uberbond|110 uberbond
111 exocortex|112 futureiface|113 neuralsafety|114 life|115 stoprule|116 nodebt|117 nodebt|118 dose|119 deep|120 first90
121 alien|122 boss|123 selfimprove|124 selfimprove|125 selfimprove|126 selfimprove|127 lineage|128 objective|129 ontology|130 ontology
131 priorart|132 research|133 research frontierradar|134 rights|135 provenance|136 nohalluc|137 conflict|138 media|139 noslopvis|140 tournament
141 benchlab|142 benchlab|143 benchlab empirical|144 benchlab|145 benchlab masterpiece|146 readerturing sealed|147 counterfeit|148 explain|149 counterfeit|150 antipretension
151 gaming|152 counterfeit|153 counterfeit|154 sealed|155 hostile|156 controls|157 nodash|158 a11y|159 perf|160 compiler
161 sessionobj|162 possession|163 twin|164 receipt|165 receipt|166 claims|167 longitudinal|168 longitudinal|169 atscale|170 season3
171 seasons|172 crossseason|173 crossseason global|174 attention|175 attention|176 attention|177 registry|178 registry|179 tournament|180 registry
181 principles14|182 principles14|183 continuity|184 oracle|185 oracle|186 blockers|187 autonomy|188 deploy|189 merge|190 receipts
191 ledger|192 ledger|193 empirical|194 empirical sealed|195 privacy|196 noaddiction|197 sovereignty|198 principles|199 principles satisfaction|200 principles taste
201 principles|202 principles|203 principles fiv|204 principles possession|205 principles originality|206 principles|207 principles|208 principles selfimprove|209 declarations|210 declarations possession
211 compounding declarations|212 selfimprove declarations|213 life declarations|214 artifacts|215 implement|216 experiences|217 mq|218 implement|219 qualityfloor|220 oatmeal
221 critics|222 asymmetry|223 asymmetry research|224 tournament|225 tournament primary|226 conversation|227 texture|228 texture|229 texture quotes|230 cultivation
231 cultivation|232 socialfeedback|233 observability|234 observability|235 atscale|236 civgraph|237 civgraph compounding|238 compounding|239 compounding|240 compounding
241 compounding|242 compounding|243 autophagy|244 autophagy|245 futureiface providerneutral|246 providerneutral|247 recovery|248 noselfgrant|249 noselfgrant|250 redteam oracle
251 redteam|252 redteam|253 registry|254 principles14|255 registry|256 redteam|257 selfimprove|258 lineage|259 redteam|260 implement
261 implement empirical|262 deploy empirical|263 empirical|264 gaming|265 empirical claims|266 continuity oracle|267 oracle|268 karamazov|269 lit masterpiece|270 masterpiece
271 oracle|272 continuity|273 autonomy|274 autonomy|275 autonomy|276 report|277 ledger blockers|278 redteam|279 redteam|280 redteam
281 ontology|282 declarations|283 declarations|284 empirical declarations|285 claims|286 northstar|287 northstar|288 principles masterpiece|289 principles asymmetry|290 life principles
291 masterpiece principles|292 counterfeit principles|293 fiv principles|294 compounding principles|295 selfimprove principles|296 longitudinal principles|297 sovereignty principles|298 nohalluc principles|299 oracle|300 northstar`;
const parse = (tag, txt) =>
  Object.fromEntries(txt.trim().split(/[|\n]/).map((x) => x.trim()).filter(Boolean).map((x) => {
    const [n, ...ids] = x.split(/\s+/);
    return [tag + '.' + n, ids];
  }));
module.exports = Object.assign({}, parse('M1', M1), parse('M2', M2), parse('M3', M3));
