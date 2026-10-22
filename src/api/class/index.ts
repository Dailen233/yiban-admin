import request from '/@/utils/request';
// import { objectToFormData } from "/@/utils/formDataFormat";// post请求参数是form-data时，使用此方法处理数据
import { GetClassParams } from "./type"
/**
 * 班级接口集合
 * @method getClass 班级列表获取
 */
export function useClassApi() {
	return {
		getClass: (params: GetClassParams) => {
			return request({
				url: '/admin/classInfos',
				method: 'get',
				params: params,
			});
		},
	};
}
