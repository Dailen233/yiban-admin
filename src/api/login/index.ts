import request from '/@/utils/request';
import { objectToFormData } from "/@/utils/formDataFormat";// post请求参数是form-data时，使用此方法处理数据
import { LoginParams } from './type';

/**
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		signIn: (params: LoginParams) => {
			return request({
				url: '/admin/login',
				method: 'post',
				data: objectToFormData(params),
			});
		},
		signOut: (params: object) => {
			return request({
				url: '/common/logout',
				method: 'post',
				data: objectToFormData(params),
			});
		},
	};
}
