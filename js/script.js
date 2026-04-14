// Função responsável por atualizar o painel com o texto da etapa clicada 
function show(text){
  document.getElementById('panel').innerText = text;
}

// Função responsável pelo download da imagem 
function downloadPNG(){
  const svg = document.getElementById("fluxo");

  // Clona o SVG
  const clone = svg.cloneNode(true);

  // Injeta os estilos direto dentro do SVG (ESSENCIAL)
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
    .box { fill:#006F3C; rx:10; }
    .text { fill:white; font-size:13px; text-anchor:middle; dominant-baseline:middle; }
    .decision { fill:#000; }
    .line { stroke:#d32f2f; stroke-width:2; fill:none; marker-end:url(#arrow); }
    .label { font-size:12px; fill:#333; font-weight:bold; }
  `;
  clone.insertBefore(style, clone.firstChild);

  // Fundo branco (evita imagem escura)
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("width", "100%");
  bg.setAttribute("height", "100%");
  bg.setAttribute("fill", "#ffffff");
  clone.insertBefore(bg, clone.firstChild);

  // Define tamanho fixo
  const width = svg.clientWidth;
  const height = svg.clientHeight;

  clone.setAttribute("width", width);
  clone.setAttribute("height", height);

  // Serializa
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);

  // Canvas em alta resolução
  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const img = new Image();

  // IMPORTANTE: evita problema de encoding
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(img, 0, 0);

    URL.revokeObjectURL(url);

    const link = document.createElement("a");
    link.download = "fluxo-kawasaki.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  img.onerror = function(){
    alert("Erro ao gerar imagem. Possível problema com a logo.");
  };

  img.src = url;
}