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
        const numberOfParticles = 3500;
        const mappedImage: any[] = [];
        let animationFrameId: number;
        if (canvas) {
            const img = new Image();
            img.src = "/images/palehazy-logo.png"
            const ctx = canvas.getContext('2d');
            


            ctx!.clearRect(0, 0, canvas.width, canvas.height);

            img.onload = () => {
                // canvas.width = img.width;
                // canvas.height = img.height;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                const pixels = ctx?.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                if (pixels) {
                    for (let y = 0; y < canvas.height; y++) {
                        let row = [];
                        for (let x = 0; x < canvas.width; x++) {
                            const red =
                                pixels.data[y * 4 * pixels.width + x * 4];
                            const green =
                                pixels.data[y * 4 * pixels.width + x * 4 + 1];
                            const blue =
                                pixels.data[y * 4 * pixels.width + x * 4 + 2];
                            const brightness = calculateRelativeBrightness(
                                red,
                                green,
                                blue
                            );
                            const cell = [brightness, red, green, blue];
                            row.push(cell);
                        }
                        mappedImage.push(row);
                    }
                }
                let highestBrightness = 0;
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
                        this.y = canvas!.height + (Math.random() * canvas!.height) - 50;
                        this.speed = 0;
                        this.velocity = Math.random() * 0.05;
                        this.size = Math.random() * 0.5 + 1;
                        this.position1 = Math.floor(this.y);
                        this.position2 = Math.floor(this.x);
                        this.angle = 0;
                    }

                    brightnessMovement(brightness: number) {
                        if (brightness > highestBrightness) {
                            highestBrightness = brightness;
                        }

                        if (brightness >= 1) {
                            return 0.7;
                        }
                        return 1 - brightness;
                        //if the brightness is high lower the output
                    }
                    get brightness() {
                        return (
                            mappedImage?.[this.position1]?.[
                                this.position2
                            ]?.[0] ?? this.speed
                        );
                    }
                    update() {
                        this.position1 = Math.floor(this.y);
                        this.position2 = Math.floor(this.x);
                        // this.y += this.velocity + 0.5;
                        //is the brightness of the current pixel
                        this.speed = this.brightness / 2;

                        // let movement = (2.5 - this.speed) + this.velocity;
                        let movement =
                            1 * Math.random();
                        // let speedFilter = this.speed > 1;
                        this.angle += this.speed / 50;

                        this.y -= movement / 0.9;




                      
                        // this.x += movement / 2;

                        if (this.y <= 0) {
                            this.y = canvas!.height;
                            this.x = Math.random() * canvas!.width;
                        }
                        if (this.x >= canvas!.width) {
                            this.x = 0;
                            this.y = Math.random() * canvas!.height;
                        }
                    }

                    blueFilter(rgb: rgb) {
                        if (rgb.blue < 150) {
                            rgb.red = 0;
                            rgb.green = 80;
                            rgb.blue = 150;
                        } else {
                            rgb.red = 225;
                            rgb.green = 225;
                            rgb.blue = 225;
                        }
                    }

                    redFilter(rgb: rgb) {
                        if (rgb.red < 150) {
                            rgb.red = 155;
                            rgb.green = 20;
                            rgb.blue = 20;
                        } else {
                            rgb.red = 225;
                            rgb.green = 225;
                            rgb.blue = 225;
                        }
                    }

                    greenFilter(rgb: rgb) {
                        if (rgb.red < 150) {
                            rgb.red = 0;
                            rgb.green = 195;
                            rgb.blue = 20;
                        } else {
                            rgb.red = 225;
                            rgb.green = 225;
                            rgb.blue = 225;
                        }
                    }
                    filterColor(red: number, green: number, blue: number) {
                        const rgb = {
                            red,
                            green,
                            blue,
                        };
                        switch(cState.filter) {
                            case 'blue' : 
                            this.blueFilter(rgb);
                            break;
                            default: break;
                        }
                        return `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
                    }

                    get particle () {
                        return mappedImage?.[this.position1]?.[this.position2];
                    }

                    get red () {
                        return this.particle?.[1];
                    }

                    get green () {
                        return this.particle?.[2];
                    }

                    get blue () {
                        return this.particle?.[3];
                    }

                    draw() {


                        // if(this.red && this.red > Math.random() * 50 && this.green && this.green > Math.random()*150 && this.blue && this.blue < Math.random()*75) {
                           
                        //     ctx!.fillStyle = this.filterColor(0, 0, 0);
                        // } else {
                            ctx!.fillStyle = this.filterColor(this.red, this.green, this.blue);
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
            };
            return () => {
                window.cancelAnimationFrame(animationFrameId)
                ctx?.restore();
            }
        }
    
    }, [cState.filter]);
    return (
        <canvas
            height={400}
            width={400}
            ref={(r) => {
                if (r) {
                    canvasRef.current = r;
                }
            }}
        ></canvas>
    );
};

export default Canvas;


function deltaRgb (rgb1: number[], rgb2: number[]) {
    const [ r1, g1, b1 ] = rgb1,
          [ r2, g2, b2 ] = rgb2,
          drp2 = Math.pow(r1 - r2, 2),
          dgp2 = Math.pow(g1 - g2, 2),
          dbp2 = Math.pow(b1 - b2, 2),
          t = (r1 + r2) / 2
  
    return Math.sqrt(2 * drp2 + 4 * dgp2 + 3 * dbp2 + t * (drp2 - dbp2) / 256)
  }