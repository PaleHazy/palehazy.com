import scss from "./Techs.module.scss";
import Image from "next/image";
interface TechIconProps {
    name: string;
    icon: string;

}
const WIDTH = 50
const HEIGHT = 50
export function TechIcon({name,icon}: TechIconProps) {
    return (
        <div className={scss.techIcon}>
            <Image src={icon} alt={name} width={WIDTH} height={HEIGHT}  />
            <p>{name}</p>
        </div>
    );
}

export function TechStack({children}:any) {
    return <div className={scss.techStack}>{children}</div>;
}