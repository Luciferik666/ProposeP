let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.initialAngle = 0;
  }

  init(paper) {
    paper.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.prevTouchX = touch.clientX;
        this.prevTouchY = touch.clientY;
      } else if (e.touches.length === 2) {
        this.rotating = true;
        this.initialAngle = this.getAngle(e.touches[0], e.touches[1]);
      }
    });

    paper.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();

        if (this.rotating && e.touches.length === 2) {
          const angle = this.getAngle(e.touches[0], e.touches[1]);
          const angleDiff = angle - this.initialAngle;
          this.rotation += angleDiff;
          this.initialAngle = angle;
        } else if (this.holdingPaper && e.touches.length === 1) {
          const touch = e.touches[0];
          this.velX = touch.clientX - this.prevTouchX;
          this.velY = touch.clientY - this.prevTouchY;
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
          this.prevTouchX = touch.clientX;
          this.prevTouchY = touch.clientY;
        }

        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      },
      { passive: false }
    );

    paper.addEventListener("touchend", (e) => {
      if (e.touches.length === 0) {
        this.holdingPaper = false;
        this.rotating = false;
      }
    });
  }

  getAngle(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
