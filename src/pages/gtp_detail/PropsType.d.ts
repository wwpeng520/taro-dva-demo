import { PropsType } from '../PropsType'
import { CommonState } from '../../models/common';
import { ConfigState } from '../../models/config';

export interface IProps extends PropsType {
  common: CommonState;
  config: ConfigState;
}

export interface PagePropsType extends PropsType, CommonState, ConfigState {}
