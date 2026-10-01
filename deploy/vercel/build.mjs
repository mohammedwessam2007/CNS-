// Renaissance-only Vercel build. This branch deliberately excludes the medical CNS shell and assets.
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const here=(p)=>new URL(p,import.meta.url);
const SRC=here("../../source/public/");
const OUT=here("./dist/");
const ASSETS=[
  "index.html",
  "renaissance-v1.css",
  "renaissance-standalone.css",
  "renaissance-standalone.js",
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
const info={
  app:"RENAISSANCE · INTELLECTUALITY",
  mode:"standalone",
  source:"CNS- Renaissance organ",
  gitCommit:process.env.VERCEL_GIT_COMMIT_SHA||null,
  gitBranch:process.env.VERCEL_GIT_COMMIT_REF||null,
  builtAt:new Date().toISOString(),
  assetCount:ASSETS.length,
  totalBytes:Object.values(integrity).reduce((n,x)=>n+x.bytes,0),
  integrity
};
await writeFile(new URL("build-info.json",OUT),JSON.stringify(info,null,2));
console.log("[renaissance-build] ready", {assetCount:info.assetCount,totalBytes:info.totalBytes,gitCommit:info.gitCommit});
