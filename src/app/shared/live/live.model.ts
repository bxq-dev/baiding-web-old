import { LiveStatus } from './live.enums';
import { UserInfoModel } from '../user-info/user-info.model';

export class LiveInfoModel {
  id: string;
  subject: string;
  desc: string;
  coverUrl: string;
  kind: string;
  status: LiveStatus;
  isDraft: boolean;
  owner: UserInfoModel;
  admin: UserInfoModel;
  editors: UserInfoModel[];
  praised: number;
  commented: number;
  niced: number;
  shared: number;
  lcConvId: string;
  hadPraised: boolean;
  praisedAnimations: UserInfoModel[] = [];
  expectStartAt: string;
  expectDuration: number;
  startedAt: string;
  closedAt: string;
  createdAt: string;
}
