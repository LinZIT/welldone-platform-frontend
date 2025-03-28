import { ReactElement } from "react";

export type Option = {
    text: string;
    icon: ReactElement;
    path: string;
    external?: boolean;
}