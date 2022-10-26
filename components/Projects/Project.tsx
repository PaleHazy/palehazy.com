import { PropsWithChildren } from 'react';
import scss from './Project.module.scss';
interface ProjectProps {
    name: string;
    description?: string;
    url: string;
}

export function Project({ name, url, description }: ProjectProps) {
    return (
        <div className={scss.project}>
          <h3>

            <a href={url} target="_blank">
                {name}
            </a>
          </h3>
          <p>
            {description}
          </p>
        </div>
    );
}

export function ProjectsContainer({ children }: PropsWithChildren<any>) {
    return <div className={scss.projectsContainer}>{children}</div>;
}