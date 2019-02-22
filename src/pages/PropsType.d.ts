import { Dispatch } from 'redux'

interface IDvaLoadingProps {
    global: boolean;
    models: {
        [propName: string]: boolean
    };
    effects: {
        [propName: string]: boolean
    };
}

export interface PropsType {
    dispatch: Dispatch<any>;
    loading: IDvaLoadingProps;
}
