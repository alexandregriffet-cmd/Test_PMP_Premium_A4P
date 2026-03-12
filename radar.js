window.PMPRadar = {
  render(canvas, scores, config){
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const keys = Object.keys(scores);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.34;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font = '13px Inter, Arial, sans-serif';

    for(let ring=1; ring<=5; ring++){
      ctx.beginPath();
      keys.forEach((key, i) => {
        const angle = (-Math.PI/2) + (i * 2 * Math.PI / keys.length);
        const r = radius * (ring / 5);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if(i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.closePath();
      ctx.strokeStyle = '#d7e3f3';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    keys.forEach((key, i) => {
      const angle = (-Math.PI/2) + (i * 2 * Math.PI / keys.length);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#d7e3f3';
      ctx.stroke();

      const label = config.dimensions[key].label;
      const lx = centerX + Math.cos(angle) * (radius + 30);
      const ly = centerY + Math.sin(angle) * (radius + 30);
      ctx.fillStyle = '#334155';
      ctx.fillText(label, lx - 30, ly);
    });

    ctx.beginPath();
    keys.forEach((key, i) => {
      const angle = (-Math.PI/2) + (i * 2 * Math.PI / keys.length);
      const r = radius * (scores[key] / 100);
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if(i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(29,78,216,.18)';
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();
  }
};