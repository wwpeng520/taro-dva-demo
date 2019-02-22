import { PropsType } from '../PropsType'
import { CommonState } from '../../models/common'

export interface HomeState {
  videoShare: any[];
  carousels: any[];
  gtps: any[];
}

export interface IProps extends PropsType {
  common: CommonState;
  home: HomeState
}

export interface PagePropsType extends PropsType, CommonState, HomeState {}
