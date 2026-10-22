// 接口接收参数类型定义
// 登陆参数
export interface LoginParams {
  Account: string,
  Password: string
}

// 接口返回参数类型定义
// 用户信息
export interface UserInfosState {
	userName: string;
	sysUserID: number;
	photo: string;

	// time: number;
	roles: string[];
	// authBtnList: string[];
}

export interface UserInfosStates {
	userInfos: UserInfosState;
}