#!/usr/bin/env python3
"""Generate lightweight, original pixel textures for the GRModPro Bedrock resource pack.

The textures are procedural originals, not copied from Minecraft's asset files.
They intentionally stay 16x16/32x32 for mobile performance.
"""
from pathlib import Path
import math, random, struct, zlib

ROOT = Path("packs/grmodpro-realism-rp/textures")
random.seed(26052)

def png(path, pixels, w, h):
    path.parent.mkdir(parents=True, exist_ok=True)
    raw = b"".join(b"\x00" + bytes(channel for p in pixels[y*w:(y+1)*w] for channel in p) for y in range(h))
    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xffffffff)
    data = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    path.write_bytes(data)

def texture(name, base, variation, size=16, mode="noise", accent=None):
    pixels=[]
    for y in range(size):
        for x in range(size):
            n=random.randint(-variation, variation)
            if mode=="stone" and random.random()<0.12: n-=variation//2
            if mode=="grain": n += int(5*math.sin((x+y*0.3)*1.4))
            if mode=="wood":
                n += int(variation*0.6*math.sin(x*1.8)) + (8 if x in (2,3,10,11) else 0)
            if mode=="grass" and y < 3: n += 12
            if mode=="ore" and random.random()<0.11: 
                c=accent or (70,190,220)
                pixels.append(tuple(max(0,min(255,v+random.randint(-12,12))) for v in c)+(255,))
                continue
            pixels.append(tuple(max(0,min(255,v+n)) for v in base)+(255,))
    png(ROOT / name, pixels, size, size)

# Vanilla-style Bedrock resource paths. Compact textures prioritize mobile performance.
texture("blocks/stone.png",(111,116,119),18,mode="stone")
texture("blocks/cobblestone.png",(100,104,105),22,mode="stone")
texture("blocks/deepslate.png",(61,67,73),14,mode="stone")
texture("blocks/dirt.png",(113,79,49),19,mode="grain")
texture("blocks/grass_top.png",(91,139,64),20,mode="grass")
texture("blocks/grass_side.png",(105,91,57),18,mode="grain")
texture("blocks/sand.png",(218,202,151),12,mode="grain")
texture("blocks/gravel.png",(133,131,124),25,mode="stone")
texture("blocks/granite.png",(151,104,86),20,mode="stone")
texture("blocks/andesite.png",(133,137,135),15,mode="stone")
texture("blocks/deepslate_iron_ore.png",(64,70,74),12,mode="ore",accent=(202,151,112))
texture("blocks/iron_ore.png",(112,112,106),12,mode="ore",accent=(194,143,103))
texture("blocks/diamond_ore.png",(77,105,104),12,mode="ore",accent=(83,218,211))
texture("blocks/coal_ore.png",(104,108,109),12,mode="ore",accent=(38,40,42))
texture("blocks/gold_ore.png",(111,108,83),12,mode="ore",accent=(240,190,54))
texture("blocks/oak_planks.png",(145,105,63),18,mode="wood")
texture("blocks/spruce_planks.png",(107,76,48),15,mode="wood")
texture("blocks/oak_log.png",(111,78,48),15,mode="wood")
texture("blocks/oak_log_top.png",(154,119,78),13,mode="grain")
texture("blocks/glass.png",(168,207,213),7,mode="grain")
texture("blocks/obsidian.png",(42,34,59),13,mode="stone")
texture("blocks/ice.png",(161,211,224),10,mode="grain")
texture("blocks/snow.png",(229,237,238),7,mode="grain")
texture("blocks/netherrack.png",(125,54,49),18,mode="stone")
texture("blocks/ancient_debris_side.png",(85,65,53),12,mode="ore",accent=(167,111,71))
texture("blocks/water_still.png",(48,121,158),10,mode="grain")
texture("blocks/water_flow.png",(43,116,154),12,mode="grain")
texture("blocks/leaves_oak.png",(65,112,53),28,mode="grain")
texture("blocks/leaves_spruce.png",(42,87,55),21,mode="grain")
texture("items/iron_sword.png",(180,189,193),18,mode="grain",size=16)
texture("items/diamond_sword.png",(69,210,202),15,mode="grain",size=16)
texture("items/iron_pickaxe.png",(176,181,181),18,mode="grain",size=16)
texture("items/diamond_pickaxe.png",(63,197,190),15,mode="grain",size=16)

print(f"Generated original lightweight realism textures under {ROOT}")
