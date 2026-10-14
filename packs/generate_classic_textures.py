#!/usr/bin/env python3
"""Generate original bright, stylized pixel-art textures for GRModPro Classic Blocks."""
from pathlib import Path
import random, struct, zlib

ROOT=Path("packs/grmodpro-classic-rp/textures")
random.seed(26052)

def png(path,pixels,w,h):
    path.parent.mkdir(parents=True,exist_ok=True)
    raw=b"".join(b"\x00"+bytes(ch for p in pixels[y*w:(y+1)*w] for ch in p) for y in range(h))
    def chunk(kind,data):
        return struct.pack(">I",len(data))+kind+data+struct.pack(">I",zlib.crc32(kind+data)&0xffffffff)
    data=b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",struct.pack(">IIBBBBB",w,h,8,6,0,0,0))+chunk(b"IDAT",zlib.compress(raw,9))+chunk(b"IEND",b"")
    path.write_bytes(data)

def tile(name,base,accent,mode="speckle"):
    w=h=16; pixels=[]
    for y in range(h):
        for x in range(w):
            if mode=="grass" and y<4:
                c=random.choice([(70,160,49),(83,177,56),(98,190,63),(57,143,43)])
            elif mode=="dirt" and random.random()<.18:
                c=random.choice([(95,59,34),(145,94,49),(166,112,59)])
            elif mode=="wood" and x%4==0:
                c=tuple(max(0,v-24) for v in base)
            elif mode=="ore" and random.random()<.14:
                c=accent
            elif random.random()<.12:
                c=accent
            else:
                n=random.choice([-10,-5,0,0,0,5,10])
                c=tuple(max(0,min(255,v+n)) for v in base)
            pixels.append((*c,255))
    png(ROOT/name,pixels,w,h)

tile("blocks/stone.png",(133,137,140),(150,154,157))
tile("blocks/cobblestone.png",(112,116,119),(83,88,91))
tile("blocks/dirt.png",(130,88,50),(159,111,60),"dirt")
tile("blocks/grass_top.png",(81,169,53),(115,199,67),"grass")
tile("blocks/grass_side.png",(119,142,63),(127,91,49),"dirt")
tile("blocks/sand.png",(230,211,143),(246,229,165))
tile("blocks/gravel.png",(142,139,129),(104,104,100))
tile("blocks/deepslate.png",(72,79,87),(57,63,70))
tile("blocks/iron_ore.png",(115,119,120),(227,174,129),"ore")
tile("blocks/diamond_ore.png",(91,111,112),(75,226,225),"ore")
tile("blocks/coal_ore.png",(115,119,120),(42,44,47),"ore")
tile("blocks/gold_ore.png",(115,119,120),(248,196,50),"ore")
tile("blocks/oak_planks.png",(174,130,76),(202,157,95),"wood")
tile("blocks/spruce_planks.png",(111,79,49),(139,100,60),"wood")
tile("blocks/glass.png",(178,222,235),(235,250,255))
tile("blocks/obsidian.png",(48,35,69),(90,56,126))
tile("blocks/ice.png",(167,216,241),(223,245,255))
tile("blocks/snow.png",(232,241,248),(255,255,255))
tile("blocks/netherrack.png",(132,57,53),(164,73,65))
tile("blocks/ancient_debris_side.png",(91,68,55),(194,139,78))
tile("blocks/water_still.png",(50,125,218),(87,171,241))
tile("blocks/oak_leaves.png",(57,133,49),(83,169,58))
tile("blocks/spruce_leaves.png",(38,93,61),(52,123,73))
# Clear icon used to identify this pack in Minecraft's resource-pack list.
icon=[]
for y in range(64):
    for x in range(64):
        if 8<=x<=55 and 8<=y<=55:
            if y<31: c=(76,166,53,255)
            else: c=(130,84,47,255)
            if (x+y)%9==0: c=(110,194,66,255) if y<31 else (155,103,57,255)
            icon.append(c)
        else: icon.append((0,0,0,0))
png(Path("packs/grmodpro-classic-rp/pack_icon.png"),icon,64,64)
print("Generated original classic-style textures and pack icon.")
