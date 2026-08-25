GRMODPRO
# <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GRModPro - Minecraft Mods</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      background: #101318;
      color: white;
    }

    header {
      padding: 25px 18px;
      text-align: center;
      background: #171c23;
      border-bottom: 1px solid #2b323d;
    }

    .logo {
      font-size: 34px;
      font-weight: 900;
    }

    .subtitle {
      margin-top: 7px;
      color: #aeb7c4;
    }

    .search-area {
      padding: 20px;
      max-width: 900px;
      margin: auto;
    }

    #search {
      width: 100%;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #343c48;
      background: #1b2129;
      color: white;
      font-size: 16px;
      outline: none;
    }

    .filters {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-top: 14px;
    }

    button {
      border: 0;
      border-radius: 10px;
      padding: 11px 15px;
      background: #242c37;
      color: white;
      cursor: pointer;
      white-space: nowrap;
    }

    button:hover,
    button.active {
      background: #3b4655;
    }

    main {
      max-width: 1100px;
      margin: auto;
      padding: 10px 20px 40px;
    }

    .section-title {
      font-size: 24px;
      margin: 15px 0;
    }

    .mods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .mod {
      background: #191f27;
      border: 1px solid #2d3540;
      border-radius: 16px;
      padding: 18px;
      transition: 0.2s;
    }

    .mod:hover {
      transform: translateY(-3px);
    }

    .mod h3 {
      font-size: 20px;
      margin-bottom: 8px;
    }

    .description {
      color: #aeb7c4;
      line-height: 1.4;
      margin-bottom: 14px;
    }

    .tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .tag {
      background: #252d38;
      padding: 5px 8px;
      border-radius: 7px;
      font-size: 12px;
      color: #d8dee7;
    }

    .download {
      display: inline-block;
      text-decoration: none;
      background: #ffffff;
      color: #101318;
      padding: 10px 14px;
      border-radius: 9px;
      font-weight: bold;
    }

    footer {
      text-align: center;
      padding: 30px;
      color: #7f8997;
      border-top: 1px solid #2b323d;
    }

    @media (max-width: 500px) {
      .logo {
        font-size: 29px;
      }

      main {
        padding-left: 14px;
        padding-right: 14px;
      }
    }
  </style>
</head>

<body>

<header>
  <div class="logo">🌎 GRModPro</div>
  <div class="subtitle">Find your next Minecraft mod</div>
</header>

<div class="search-area">

  <input
    id="search"
    type="text"
    placeholder="🔎 Search mods..."
    oninput="searchMods()"
  >

  <div class="filters">
    <button onclick="filterMods('all')" class="active">All</button>
    <button onclick="filterMods('bedrock')">🎮 Bedrock</button>
    <button onclick="filterMods('java')">💻 Java</button>
    <button onclick="filterMods('shader')">✨ Shaders</button>
    <button onclick="filterMods('horror')">👻 Horror</button>
    <button onclick="filterMods('realistic')">🌎 Realistic</button>
    <button onclick="filterMods('mob')">🐉 Mobs</button>
  </div>

</div>

<main>

  <h2 class="section-title">🔥 Popular Mods</h2>

  <div class="mods" id="mods">

    <div class="mod" data-category="bedrock shader">
      <h3>✨ Realistic Visuals</h3>
      <p class="description">
        A visual pack designed to give Minecraft a more realistic atmosphere.
      </p>

      <div class="tags">
        <span class="tag">Bedrock</span>
        <span class="tag">Shaders</span>
      </div>

      <a class="download" href="#" onclick="sourceAlert()">
        View Mod
      </a>
    </div>

    <div class="mod" data-category="bedrock horror">
      <h3>👻 Horror Survival</h3>
      <p class="description">
        Add a creepy atmosphere and horror-style gameplay to your survival world.
      </p>

      <div class="tags">
        <span class="tag">Bedrock</span>
        <span class="tag">Horror</span>
      </div>

      <a class="download" href="#" onclick="sourceAlert()">
        View Mod
      </a>
    </div>

    <div class="mod" data-category="bedrock realistic">
      <h3>🌎 Realistic Survival</h3>
      <p class="description">
        Adds realistic survival mechanics and environmental features.
      </p>

      <div class="tags">
        <span class="tag">Bedrock</span>
        <span class="tag">Realistic</span>
      </div>

      <a class="download" href="#" onclick="sourceAlert()">
        View Mod
      </a>
    </div>

    <div class="mod" data-category="java mob">
      <h3>🐉 New Mobs</h3>
      <p class="description">
        Discover new creatures and mobs for your Minecraft adventures.
      </p>

      <div class="tags">
        <span class="tag">Java</span>
        <span class="tag">Mobs</span>
      </div>

      <a class="download" href="#" onclick="sourceAlert()">
        View Mod
      </a>
    </div>

  </div>

</main>

<footer>
  GRModPro © 2026<br>
  Minecraft is a trademark of Mojang Studios.
</footer>

<script>

  let currentFilter = "all";

  function filterMods(category) {

    currentFilter = category;

    const mods = document.querySelectorAll(".mod");

    mods.forEach(mod => {

      if (
        category === "all" ||
        mod.dataset.category.includes(category)
      ) {
        mod.style.display = "block";
      } else {
        mod.style.display = "none";
      }

    });

    document.querySelectorAll("button").forEach(button => {
      button.classList.remove("active");
    });

    event.target.classList.add("active");
  }

  function searchMods() {

    const search =
      document.getElementById("search")
      .value
      .toLowerCase();

    const mods =
      document.querySelectorAll(".mod");

    mods.forEach(mod => {

      const text =
        mod.innerText.toLowerCase();

      const matchesSearch =
        text.includes(search);

      const matchesFilter =
        currentFilter === "all" ||
        mod.dataset.category.includes(currentFilter);

      mod.style.display =
        matchesSearch && matchesFilter
        ? "block"
        : "none";

    });
  }

  function sourceAlert() {
    alert(
      "GRModPro will eventually connect this button to the official mod/add-on page."
    );
  }

</script>

</body>
</html>
