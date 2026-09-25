export type Person={name:string;photo:string;price:string;country:string;topic:string};
import { PROFILES } from "@/lib/vibe-data";
export const people:Person[]=PROFILES.map(p=>({name:p.name,photo:`https://i.pravatar.cc/160?img=${p.avatar}`,price:`TZS ${p.tzs.toLocaleString()}`,country:p.country,topic:p.topic}));
