// Renaissance-only Vercel build. Medical CNS assets remain excluded.
import { copyFile, cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const here=(p)=>new URL(p,import.meta.url);
const SRC=here("../../source/public/");
const OUT=here("./dist/");
const ASSETS=[
  "index.html",
  "renaissance-v1.css",
  "renaissance-standalone.css",
  "renaissance-standalone.js",
  "reader-v1.css",
  "reader-v1.js",
  "renaissance-harvest.js",
  "campus-v1.css",
  "campus-v1.js",
  "renaissance-s1.js",
  "renaissance-s2.js",
  "renaissance-s3a.js",
  "renaissance-s3b.js",
  "renaissance-s3c.js",
  "renaissance-civ.js",
  "renaissance-genome.js",
  "renaissance-media.js",
  "renaissance-sealed.js",
  "renaissance-v1.js",
  "axis-forge-v1.js",
  "renaissance-civilization.css",
  "renaissance-civilization.js",
  "renaissance-experience.js",
  "manifest.webmanifest",
  "renaissance-sw.js"
];

await rm(OUT,{recursive:true,force:true});
await mkdir(OUT,{recursive:true});
const integrity={};
for(const name of ASSETS){
  const src=new URL(name,SRC), out=new URL(name,OUT);
  await copyFile(src,out);
  const buf=await readFile(src);
  integrity[name]={bytes:buf.byteLength,sha256:createHash("sha256").update(buf).digest("hex")};
}

await cp(here("../../source/public/harvest/"),new URL("harvest/",OUT),{recursive:true});
for(const x of await (async function w(url,prefix){const rows=[];for(const n of await readdir(url)){const u=new URL(n,url),s=await stat(u);if(s.isDirectory())rows.push(...await w(new URL(n+"/",url),prefix+n+"/"));else rows.push({rel:prefix+n,url:u});}return rows;})(new URL("harvest/",OUT),"harvest/")){
  const buf=await readFile(x.url);integrity[x.rel]={bytes:buf.byteLength,sha256:createHash("sha256").update(buf).digest("hex")};
}

const VOUT=new URL("vendor/",OUT);
await mkdir(VOUT,{recursive:true});
await copyFile(here("./node_modules/pdfjs-dist/legacy/build/pdf.mjs"),new URL("pdf.mjs",VOUT));
await copyFile(here("./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"),new URL("pdf.worker.mjs",VOUT));
await copyFile(here("./node_modules/pdfjs-dist/LICENSE"),new URL("PDFJS-LICENSE",VOUT));
await copyFile(here("./node_modules/fflate/esm/browser.js"),new URL("fflate.mjs",VOUT));
await copyFile(here("./node_modules/fflate/LICENSE"),new URL("FFLATE-LICENSE",VOUT));
for(const dir of ["cmaps","standard_fonts","wasm"]){await cp(here("./node_modules/pdfjs-dist/"+dir+"/"),new URL(dir+"/",VOUT),{recursive:true});}
await cp(here("./node_modules/tesseract.js/dist/"),new URL("tesseract/",VOUT),{recursive:true});
await cp(here("./node_modules/tesseract.js-core/"),new URL("tesseract-core/",VOUT),{recursive:true});
await mkdir(new URL("tessdata/",VOUT),{recursive:true});
await copyFile(here("./node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz"),new URL("tessdata/eng.traineddata.gz",VOUT));
await copyFile(here("./node_modules/@tesseract.js-data/ara/4.0.0_best_int/ara.traineddata.gz"),new URL("tessdata/ara.traineddata.gz",VOUT));
await copyFile(here("./node_modules/tesseract.js/LICENSE.md"),new URL("TESSERACT-JS-LICENSE",VOUT));
async function walk(url,prefix=""){const rows=[];for(const name of await readdir(url)){const u=new URL(name,url),s=await stat(u),rel=prefix+name;if(s.isDirectory())rows.push(...await walk(new URL(name+"/",url),rel+"/"));else rows.push({rel,url:u});}return rows;}
for(const x of await walk(VOUT,"vendor/")){const buf=await readFile(x.url);integrity[x.rel]={bytes:buf.byteLength,sha256:createHash("sha256").update(buf).digest("hex")};}

const info={app:"RENAISSANCE · INTELLECTUALITY",mode:"civilization+reader-os+campus",source:"CNS- Renaissance organ",gitCommit:process.env.VERCEL_GIT_COMMIT_SHA||null,gitBranch:process.env.VERCEL_GIT_COMMIT_REF||null,builtAt:new Date().toISOString(),assetCount:Object.keys(integrity).length,totalBytes:Object.values(integrity).reduce((n,x)=>n+x.bytes,0),integrity};
await writeFile(new URL("build-info.json",OUT),JSON.stringify(info,null,2));
console.log("[renaissance-build] ready", {assetCount:info.assetCount,totalBytes:info.totalBytes,gitCommit:info.gitCommit});
