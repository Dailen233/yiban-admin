import request from '/@/utils/request';
// import { objectToFormData } from "/@/utils/formDataFormat";// post请求参数是form-data时，使用此方法处理数据
import { GetCollegesParams } from "./type"

/**
 * 学院接口集合
 * @method getColleges 学院列表获取
 */
export function useCollegeApi() {
	return {
		getColleges: (params: GetCollegesParams) => {
			return request({
				url: '/collegeInfo/collegeInfos',
				method: 'get',
				params: params,
			});
		},
	};
}
