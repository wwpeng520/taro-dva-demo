import { PropsType } from '../PropsType'
import { CommonState } from '../../models/common'

export interface CollectionState {
  collections: any;
  error: any;
}
export interface IProps extends PropsType {
  common: CommonState;
  collection: CollectionState
}

export interface PagePropsType extends PropsType, CommonState, CollectionState {}
