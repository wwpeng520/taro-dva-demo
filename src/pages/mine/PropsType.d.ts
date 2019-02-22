import { PropsType } from '../PropsType'
import { CommonState } from '../../models/common'
import { MineState } from './model'

export interface IProps extends PropsType {
  common: CommonState;
  mine: MineState
}

export interface PagePropsType extends PropsType, CommonState, MineState {}
