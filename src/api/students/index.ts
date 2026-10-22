import request from '/@/utils/request';
import { objectToFormData } from "/@/utils/formDataFormat"; // post请求是form-data时，使用此方法处理数据

import { GetStudentsParams, AddStudentsParams,DelStudentsParams,UpdateStudentsParams,SearchStudentsParams } from "./type"


/**
 * 学生列表页 api 示例
 * @method getStudents 学生列表查询
 * @method addStudents 增加学生
 * @method delStudents 删除学生
 * @method updateStudents 修改学生
 * @method searchStudents 查询具体学生
 * 
 */
export function useStudentApi() {
	return {
		getStudents: (params: GetStudentsParams) => {
			return request({
				url: '/studentInfo/students',
				method: 'get',
				params: params,
			});
		},
		addStudents:(params: AddStudentsParams) => {
			return request({
				url: '/studentInfo/students',
				method: 'post',
				data: objectToFormData(params),
			});
		},
		delStudents:(stuID:number,params: DelStudentsParams) => {
			return request({
				url: '/studentInfo/student/' + stuID,
				method: 'delete',
				data: objectToFormData(params),
			});
		},
		updateStudents:(stuID:number,params: UpdateStudentsParams) => {
			return request({
				url: '/studentInfo/student/' + stuID,
				method: 'put',
				data: objectToFormData(params),
			});
		},
		searchStudents:(stuID:number,params: SearchStudentsParams) => {
			return request({
				url: '/studentInfo/student/' + stuID,
				method: 'get',
				params: params,
			});
		},
	};
}
