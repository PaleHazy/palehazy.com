import { useColorProvider } from 'contexts/Color';
import { getSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

function calculateRelativeBrightness(red: number, green: number, blue: number) {
    return (
        Math.sqrt(
            red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
        ) / 100
    );
}
type rgb = {
    red: number;
    green: number;
    blue: number;
};
const Canvas = (props: any) => {
    const [cState, set] = useColorProvider();
    const canvasRef = useRef<HTMLCanvasElement>();

    useEffect(() => {
        const canvas = canvasRef.current;
        const particlesArray: any[] = [];
        const numberOfParticles = 500;
        const mappedImage: any[] = [];
        let animationFrameId: number;
        if (canvas) {
            const ctx = canvas.getContext('2d');

            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            class Particle {
              x: number;
              y: number;
              speed: number;
              velocity: number;
              size: number;
              position1: number;
              position2: number;
              angle: number;
              constructor() {
                  this.x = Math.random() * canvas!.width; // 0.5 * 512
                  this.y = 0;
                  this.speed = 0;
                  this.velocity = Math.random() * 0.05;
                  this.size = Math.random() * 0.5;
                  this.position1 = Math.floor(this.y);
                  this.position2 = Math.floor(this.x);
                  this.angle = 0;
              }
              update() {
                  this.position1 = Math.floor(this.y);
                  this.position2 = Math.floor(this.x);
                  // this.y += this.velocity + 0.5;
                  //is the brightness of the current pixel
                  this.speed = Math.random() * 2.5;

                  // let movement = (2.5 - this.speed) + this.velocity;
                  let movement =
                      1 * Math.random();
                  // let speedFilter = this.speed > 1;
                  this.angle += this.speed / 50;

                  this.y += movement / 0.9;




                
                  // this.x += movement / 2;

                  if (this.y >= canvas!.height) {
                      this.y = 0;
                      this.x = Math.random() * canvas!.width;
                  }
                  if (this.x >= canvas!.width) {
                      this.x = 0;
                      this.y = Math.random() * canvas!.height;
                  }
              }


              draw() {


                  // if(this.red && this.red > Math.random() * 50 && this.green && this.green > Math.random()*150 && this.blue && this.blue < Math.random()*75) {
                     
                  //     ctx!.fillStyle = this.filterColor(0, 0, 0);
                  // } else {
                      ctx!.fillStyle = "rgb(0,200,25)"
                  // }
                  ctx!.beginPath();
                  ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                  ctx!.fill();
              }
          }
            const init = () => {
              for (let i = 0; i < numberOfParticles; i++) {
                  particlesArray.push(new Particle());
              }
          };
          init();
            const animate = () => {
                if (ctx) {
                    // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    ctx.globalAlpha = 0.05;
                    ctx.fillStyle = 'rgb(0,0,0)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    for (let i = 0; i < particlesArray.length; i++) {
                        particlesArray[i].update();
                        ctx.globalAlpha = particlesArray[i].speed * 0.9;
                        particlesArray[i].draw();
                    }
                }
                return requestAnimationFrame(animate);
            };
            animationFrameId = animate();

            return () => {
                window.cancelAnimationFrame(animationFrameId);
                ctx?.restore();
            };
        }
    }, [cState.filter]);
    return (
        <canvas
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            }}
            ref={(r) => {
                if (r) {
                    canvasRef.current = r;
                }
            }}
        ></canvas>
    );
};

export default Canvas;

function deltaRgb(rgb1: number[], rgb2: number[]) {
    const [r1, g1, b1] = rgb1,
        [r2, g2, b2] = rgb2,
        drp2 = Math.pow(r1 - r2, 2),
        dgp2 = Math.pow(g1 - g2, 2),
        dbp2 = Math.pow(b1 - b2, 2),
        t = (r1 + r2) / 2;

    return Math.sqrt(
        2 * drp2 + 4 * dgp2 + 3 * dbp2 + (t * (drp2 - dbp2)) / 256
    );
}
