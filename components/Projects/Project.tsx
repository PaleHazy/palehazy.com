import { PropsWithChildren } from 'react';
import style from './Project.module.scss';
interface ProjectProps {
    name: string;
    description?: string;
    url: string;
}

export function Project({ name, url, description }: ProjectProps) {
    return (
        <div className={style.project}>
          <h3>

            <a href={url} target="_blank" rel="noreferrer">
                {name}
            </a>
          </h3>
          <p>
            {description}
          </p>
        </div>
    );
}

function GlowBackground() {
    return (
        <div className={style.glowBackground}>
            <div className={style.glowBackground__inner} />
        </div>
    );
}

export function ProjectsContainer({ children }: PropsWithChildren<any>) {
    return <div className={style.projectsContainer}>{children}</div>;
}