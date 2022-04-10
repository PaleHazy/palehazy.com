import { useColorProvider } from 'contexts/Color';
import { getSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { kittyBase64 } from './kitty';

function calculateRelativeBrightness(red: number, green: number, blue: number) {
    return Math.sqrt(
        red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
    ) / 100
}
type rgb = {
    red: number,
    green: number,
    blue: number
}
const Canvas = (props: any) => {
    const [,set] = useColorProvider()
    const canvasRef = useRef<HTMLCanvasElement>();
    useEffect(() => {
        const canvas = canvasRef.current;
        const particlesArray: any[] = [];
        const numberOfParticles = 7000;
        const mappedImage: any[] = [];
        if (canvas) {
            const img = new Image();
            img.src = kittyBase64;
            const ctx = canvas.getContext('2d');
            set
            ctx!.clearRect(0,0,canvas.width, canvas.height)
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
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
                            const cell = [brightness, red, green, blue,];
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
                    constructor() {
                        this.x = Math.random() * canvas!.width; // 0.5 * 512
                        this.y = 0;
                        this.speed = 0;
                        this.velocity = Math.random() * 0.1;
                        this.size = Math.random() * 1.5 + 0.42;
                        this.position1 = Math.floor(this.y);
                        this.position2 = Math.floor(this.x);
                    }

                    brightnessMovement(brightness:number) {
                        if(brightness > highestBrightness) {
                            highestBrightness=brightness;
                        }

                        if(brightness >= 1) {
                            return 0.7;
                        }
                        return 1 - brightness
                        //if the brightness is high lower the output
                    }
                    update() {
                        this.position1 = Math.floor(this.y);
                        this.position2 = Math.floor(this.x);
                        // this.y += this.velocity + 0.5;
                        //is the brightness of the current pixel
                        this.speed = mappedImage[this.position1][this.position2][0];
                        
                        // let movement = (2.5 - this.speed) + this.velocity;
                        let movement = this.brightnessMovement(this.speed) + this.velocity;
                        this.y += movement;
                        this.x += movement * 2;

                        if (this.y >= canvas!.height) {
                            this.y = 0;
                            this.x = Math.random() * canvas!.width;
                        }
                        if (this.x >= canvas!.width) {
                            this.x = 0;
                            this.y = Math.random() * canvas!.height;
                        }
                    }

                    blueFilter(rgb: rgb) {
                        if(rgb.blue < 150) {
                            rgb.red = 0;
                            rgb.green = 80;
                            rgb.blue = 150

                        } else {
                           rgb.red = 225;
                            rgb.green = 225;
                            rgb.blue = 225;
                        }
                    }
                  
                    redFilter(rgb: rgb) {
                        if(rgb.red < 150) {
                            rgb.red = 155;
                            rgb.green = 20;
                            rgb.blue = 20

                        } else {
                           rgb.red = 225;
                            rgb.green = 225;
                            rgb.blue = 225;
                        }
                    }
                    
                    greenFilter(rgb: rgb) {
                        if(rgb.red < 150) {
                            rgb.red = 0;
                            rgb.green = 195;
                            rgb.blue = 20

                        } else {
                           rgb.red = 225;
                            rgb.green = 225;
                            rgb.blue = 225;
                        }
                    }
                    filterColor(red:number, green:number,blue:number) {
                        const rgb = {
                            red,
                            green,
                            blue
                        }
                        this.blueFilter(rgb);
                        return `rgb(${rgb.red},${rgb.green},${rgb.blue})`
                    }
                    draw() {
                        let red = mappedImage[this.position1][this.position2][1];
                        let green = mappedImage[this.position1][this.position2][2];
                        let blue = mappedImage[this.position1][this.position2][3];
                        ctx!.beginPath();
                        ctx!.fillStyle =  this.filterColor(red, green, blue)
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
                        ctx.globalAlpha = 0.2;

                        for (let i = 0; i < particlesArray.length; i++) {
                            particlesArray[i].update();
                            ctx.globalAlpha = particlesArray[i].speed * 0.5;
                            particlesArray[i].draw();
                        }
                    }
                    requestAnimationFrame(animate);
                };
                animate();
            };
        }
    }, [props.filter]);
    return (
        <canvas
            height={473}
            width={1024}
            ref={(r) => {
                if (r) {
                    canvasRef.current = r;
                }
            }}
        ></canvas>
    );
};

export async function getServerSideProps(ctx: any) {
    return {
        props: {
            session: await getSession(ctx),
        },
    };
}
export default Canvas;


