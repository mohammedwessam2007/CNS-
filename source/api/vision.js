import { ai } from 'hatchable';

export const methods = ['POST'];
export const access = 'user';

const MAX_DATA_URL = 4_500_000;

function extractText(j) {
  if (typeof j?.output_text === 'string') return j.output_text;
  const parts = [];
  for (const o of j?.output || []) for (const c of o?.content || []) {
    if (typeof c?.text === 'string') parts.push(c.text);
  }
  return parts.join('\n');
}
function cleanJson(s) {
  const t = String(s || '').trim().replace(/^\`\`\`json\s*/i,'').replace(/\`\`\`$/,'').trim();
  return JSON.parse(t);
}

export default async function(req,res){
  const body=req.body||{},imageDataUrl=String(body.imageDataUrl||''),context=body.context||{};
  if(!/^data:image\/(jpeg|png|webp);base64,/i.test(imageDataUrl)) return res.status(400).json({error:'image_required',message:'Upload a JPEG, PNG or WebP image.'});
  if(imageDataUrl.length>MAX_DATA_URL) return res.status(413).json({error:'image_too_large',message:'Image is too large. Try a tighter crop.'});
  const safeContext={
    topic:String(context.topic||'CNS').slice(0,180),
    subject:String(context.subject||'').slice(0,80),
    facts:Array.isArray(context.facts)?context.facts.slice(0,4).map(x=>Array.isArray(x)?x.map(y=>String(y).slice(0,220)):String(x).slice(0,220)):[],
    exam:String(context.exam||'').slice(0,500),
    practical:String(context.practical||'').slice(0,500)
  };
  const system='You are the visual professor inside a private first-year medical CNS study tool. Analyze only what is visibly supportable in the supplied image. Use the supplied course context as a guide, not as proof of what is in the image. Never invent an official exam prediction or marking key. If anatomy is ambiguous, say so. Return JSON only with keys: what, look, model, examMoves (array of 2-4 concise likely question forms based on the course context, never claims of future exam certainty), trap, confidence (low|medium|high). Keep the whole answer under 450 words.';
  try{
    const r=await ai.fetch({
      provider:'openai',
      path:'/v1/responses',
      body:{
        model:'gpt-5.5',
        input:[
          {role:'system',content:[{type:'input_text',text:system}]},
          {role:'user',content:[
            {type:'input_text',text:'Current course context: '+JSON.stringify(safeContext)},
            {type:'input_image',image_url:imageDataUrl}
          ]}
        ],
        max_output_tokens:900,
        store:false
      },
      purpose:'intellectuality-professor-vision',
      timeoutMs:50000
    });
    if(!r.ok){
      const err=await r.json().catch(()=>({}));
      if(r.status===412) return res.status(412).json({error:'ai_setup_required',message:err.message||'Vision mode needs an AI connection in Hatchable setup.'});
      return res.status(502).json({error:'vision_failed',message:'Vision analysis failed. The normal course still works.'});
    }
    const j=await r.json(),text=extractText(j);
    let out;try{out=cleanJson(text)}catch(_){out={what:'Image received.',look:text.slice(0,900),model:'',examMoves:[],trap:'',confidence:'medium'}}
    return res.json(out);
  }catch(e){
    return res.status(502).json({error:'vision_failed',message:e?.message||'Vision analysis failed.'});
  }
}