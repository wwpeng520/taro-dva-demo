import { PropsType } from '../PropsType'
import { CommonState } from '../../models/common'

export interface IProps extends PropsType {
  common: CommonState;
}

export interface PagePropsType extends PropsType, CommonState {}
