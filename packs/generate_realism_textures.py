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



# Expanded texture coverage: additional common Overworld, cave, Nether, End,
# construction, and utility blocks. Procedural originals; not a complete game atlas.
for name,base,var,mode in [
 ("blocks/bedrock.png",(72,72,74),18,"stone"),
 ("blocks/clay.png",(159,164,177),9,"grain"),
 ("blocks/mud.png",(76,70,54),13,"grain"),
 ("blocks/muddy_mangrove_roots_side.png",(92,63,43),14,"wood"),
 ("blocks/moss_block.png",(80,123,55),20,"grain"),
 ("blocks/mossy_cobblestone.png",(88,112,72),20,"stone"),
 ("blocks/stone_bricks.png",(112,116,117),14,"stone"),
 ("blocks/cracked_stone_bricks.png",(105,108,109),17,"stone"),
 ("blocks/mossy_stone_bricks.png",(91,111,77),17,"stone"),
 ("blocks/tuff.png",(104,108,101),16,"stone"),
 ("blocks/calcite.png",(219,218,205),9,"grain"),
 ("blocks/dripstone_block.png",(131,94,76),17,"stone"),
 ("blocks/pointed_dripstone.png",(136,101,83),14,"grain"),
 ("blocks/terracotta.png",(153,88,65),12,"grain"),
 ("blocks/white_terracotta.png",(209,190,169),9,"grain"),
 ("blocks/bricks.png",(151,77,61),14,"stone"),
 ("blocks/mud_bricks.png",(103,82,63),13,"stone"),
 ("blocks/prismarine.png",(67,131,119),17,"stone"),
 ("blocks/dark_prismarine.png",(43,91,81),14,"stone"),
 ("blocks/sea_lantern.png",(159,218,205),12,"grain"),
 ("blocks/end_stone.png",(218,215,153),12,"grain"),
 ("blocks/end_stone_bricks.png",(195,191,132),12,"stone"),
 ("blocks/purpur_block.png",(166,117,168),12,"stone"),
 ("blocks/quartz_block_side.png",(225,222,211),7,"grain"),
 ("blocks/nether_brick.png",(66,39,40),11,"stone"),
 ("blocks/blackstone.png",(47,44,44),14,"stone"),
 ("blocks/basalt_side.png",(77,74,73),14,"wood"),
 ("blocks/soul_sand.png",(91,68,55),15,"grain"),
 ("blocks/soul_soil.png",(68,54,49),14,"stone"),
 ("blocks/crimson_planks.png",(111,46,55),14,"wood"),
 ("blocks/warped_planks.png",(43,105,99),13,"wood"),
 ("blocks/bone_block_side.png",(211,204,177),8,"grain"),
 ("blocks/hay_block_side.png",(190,157,54),16,"wood"),
 ("blocks/sponge.png",(194,180,71),16,"grain"),
 ("blocks/wet_sponge.png",(141,154,65),15,"grain"),
 ("blocks/packed_ice.png",(141,191,224),9,"grain"),
 ("blocks/blue_ice.png",(103,171,223),11,"grain"),
 ("blocks/sea_pickle.png",(111,157,79),14,"grain"),
 ("blocks/copper_ore.png",(112,103,83),12,"ore"),
 ("blocks/redstone_ore.png",(91,77,72),12,"ore"),
 ("blocks/lapis_ore.png",(67,85,137),12,"ore"),
 ("blocks/emerald_ore.png",(75,112,79),12,"ore"),
 ("blocks/nether_gold_ore.png",(76,54,47),12,"ore"),
 ("blocks/nether_quartz_ore.png",(73,48,46),12,"ore"),
 ("blocks/copper_block.png",(181,104,73),13,"grain"),
 ("blocks/exposed_copper.png",(151,124,89),13,"grain"),
 ("blocks/oxidized_copper.png",(75,143,122),14,"grain"),
 ("blocks/iron_block.png",(194,198,198),7,"grain"),
 ("blocks/gold_block.png",(235,190,54),8,"grain"),
 ("blocks/diamond_block.png",(76,204,193),8,"grain"),
 ("blocks/emerald_block.png",(54,183,105),8,"grain"),
 ("blocks/lapis_block.png",(42,75,151),8,"grain"),
 ("blocks/redstone_block.png",(166,45,39),8,"grain"),
 ("blocks/coal_block.png",(45,47,49),7,"grain"),
 ("blocks/honey_block_side.png",(209,153,39),9,"grain"),
 ("blocks/slime.png",(104,181,74),13,"grain"),
 ("blocks/powder_snow.png",(224,238,246),6,"grain"),
 ("blocks/azalea_leaves.png",(85,138,62),23,"grain"),
 ("blocks/flowering_azalea_leaves.png",(83,133,61),22,"grain"),
 ("blocks/mangrove_leaves.png",(56,117,51),24,"grain"),
 ("blocks/cherry_leaves.png",(221,151,175),19,"grain"),
 ("blocks/bamboo_block.png",(111,150,69),14,"wood"),
 ("blocks/bamboo_planks.png",(187,158,91),12,"wood"),
 ("blocks/cherry_planks.png",(190,133,127),12,"wood"),
 ("blocks/mangrove_planks.png",(117,61,52),14,"wood"),
 ("blocks/acacia_planks.png",(171,91,48),14,"wood"),
 ("blocks/birch_planks.png",(195,178,118),11,"wood"),
 ("blocks/dark_oak_planks.png",(70,48,34),12,"wood"),
 ("blocks/jungle_planks.png",(163,119,75),13,"wood"),
 ("blocks/crimson_nylium_side.png",(111,42,47),16,"stone"),
 ("blocks/warped_nylium_side.png",(41,103,96),14,"stone"),
 ("blocks/chorus_plant.png",(106,70,127),14,"wood"),
]:
    texture(name,base,var,mode=mode)

# Draw a recognizable 64x64 grass-block pack icon with original procedural pixel art.
def polygon(points, color, pixels, width=64, height=64):
    xs=[p[0] for p in points]; ys=[p[1] for p in points]
    for y in range(max(0,min(ys)), min(height,max(ys)+1)):
        for x in range(max(0,min(xs)), min(width,max(xs)+1)):
            inside=False
            j=len(points)-1
            for i in range(len(points)):
                xi,yi=points[i]; xj,yj=points[j]
                if ((yi>y)!=(yj>y)) and (x < (xj-xi)*(y-yi)/(yj-yi+1e-9)+xi):
                    inside=not inside
                j=i
            if inside:
                pixels[y*width+x]=color

def grass_block_icon():
    w=h=64
    pix=[(0,0,0,0)]*(w*h)
    # Three faces of a voxel cube.
    polygon([(8,19),(31,8),(56,20),(32,33)],(92,165,62,255),pix)
    polygon([(8,19),(32,33),(32,57),(8,43)],(113,75,45,255),pix)
    polygon([(32,33),(56,20),(56,44),(32,57)],(91,58,37,255),pix)
    # Natural grass flecks on the top face.
    rng=random.Random(931)
    for _ in range(160):
        x=rng.randrange(10,55); y=rng.randrange(9,33)
        # Keep flecks roughly inside the diamond top.
        if y >= 19-abs(x-32)*0.48 and y <= 20+abs(x-32)*0.55:
            color=rng.choice([(58,132,45,255),(123,185,69,255),(75,147,49,255),(145,192,83,255)])
            pix[y*w+x]=color
    # Pixelated dirt grains and strata on the two side faces.
    for _ in range(110):
        x=rng.randrange(9,32); y=rng.randrange(34,56)
        if y >= 33+(x-8)*0.60 and y <= 43+(x-8)*0.60:
            pix[y*w+x]=rng.choice([(139,94,55,255),(83,53,34,255),(124,81,47,255)])
    for _ in range(110):
        x=rng.randrange(33,56); y=rng.randrange(22,57)
        if y >= 33-(x-32)*0.52 and y <= 57-(x-32)*0.02:
            pix[y*w+x]=rng.choice([(117,72,43,255),(75,47,31,255),(133,82,47,255)])
    # A thin dark outline makes the block readable as a launcher/pack icon.
    outline=(42,38,31,255)
    def line(x1,y1,x2,y2,col):
        dx=abs(x2-x1); sx=1 if x1<x2 else -1
        dy=-abs(y2-y1); sy=1 if y1<y2 else -1
        err=dx+dy
        while True:
            if 0<=x1<w and 0<=y1<h: pix[y1*w+x1]=col
            if x1==x2 and y1==y2: break
            e2=2*err
            if e2>=dy: err+=dy; x1+=sx
            if e2<=dx: err+=dx; y1+=sy
    for a,b in [((8,19),(31,8)),((31,8),(56,20)),((56,20),(56,44)),((56,44),(32,57)),((32,57),(8,43)),((8,43),(8,19)),((8,19),(32,33)),((32,33),(56,20)),((32,33),(32,57))]:
        line(*a,*b,outline)
    png(Path("packs/grmodpro-realism-rp/pack_icon.png"),pix,w,h)

grass_block_icon()

print(f"Generated original lightweight realism textures under {ROOT}")
